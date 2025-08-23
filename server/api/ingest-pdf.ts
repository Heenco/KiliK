import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const text = body.text;
  const reportName = body.reportName || 'report';

  if (!text) {
    setResponseStatus(event, 400);
    return { error: 'no text provided' };
  }

  // locate python script
  const scriptPath = resolve(process.cwd(), 'server', 'ingest_pdf.py');
  // Hard-coded Python environment (recommended). Update if your venv is elsewhere.
  const python = process.env.PYTHON_PATH || 'C:/Luma/Crime/venv/Scripts/python.exe';

  // Quick pre-check: ensure python exists and required packages can be imported.
  try {
    const checkResult = await new Promise((res) => {
      const chk = spawn(python, ['-c', 'import sentence_transformers,faiss,numpy; print("OK")'], { stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '';
      let err = '';
      chk.stdout.on('data', (d) => { out += d.toString(); });
      chk.stderr.on('data', (d) => { err += d.toString(); });
      chk.on('close', (code) => {
        res({ code, out, err });
      });
    });

    if (checkResult.code !== 0 || !checkResult.out.includes('OK')) {
      setResponseStatus(event, 500);
      console.error('Python dependency check failed for ingest:', checkResult);
      return {
        error: 'python_dependencies_missing',
        message: 'Python executable not found or required packages are not installed in that environment.',
        suggestion: `${python} -m pip install sentence-transformers numpy faiss-cpu`,
        stdout: checkResult.out,
        stderr: checkResult.err
      };
    }
  } catch (e) {
    setResponseStatus(event, 500);
    console.error('Failed to run python dependency check', e);
    return { error: 'python_check_failed', detail: String(e) };
  }

  return await new Promise((resolvePromise) => {
    const proc = spawn(python, [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      if (code !== 0) {
        // set HTTP status and return error
        setResponseStatus(event, 500);
        console.error('ingest script failed:', stderr || stdout);
        resolvePromise({ error: 'ingest process failed', detail: stderr || stdout });
      } else {
        try {
          const parsed = JSON.parse(stdout);
          // Ensure expected fields exist
          if (parsed && (parsed.added !== undefined) && (parsed.total !== undefined)) {
            resolvePromise(parsed);
          } else {
            setResponseStatus(event, 500);
            console.error('ingest script returned unexpected JSON:', parsed, 'stderr:', stderr);
            resolvePromise({ error: 'invalid ingest output', detail: parsed || stdout, stderr: stderr });
          }
        } catch (e) {
          setResponseStatus(event, 500);
          console.error('failed to parse ingest script output as JSON', e, stdout, stderr);
          resolvePromise({ error: 'invalid json from ingest script', detail: stdout || stderr });
        }
      }
    });

    // write input json
    proc.stdin.write(JSON.stringify({ text, reportName }));
    proc.stdin.end();
  });
});
