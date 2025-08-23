import { spawn } from 'child_process'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.query || !body.reportName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing query or reportName'
    })
  }

  const { query, reportName, maxChunks = 5 } = body

  return new Promise((resolve, reject) => {
    // Hard-coded Python path for consistency
    const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe'
    const scriptPath = path.join(process.cwd(), 'server', 'query_chunks.py')
    
    console.log('Starting chunk query with:', { query: query.substring(0, 50) + '...', reportName, maxChunks })
    
    const pythonProcess = spawn(pythonPath, [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (stderr) {
        console.log('Python stderr:', stderr)
      }

      if (code !== 0) {
        console.error('Python process failed with code:', code)
        console.error('Stderr:', stderr)
        reject(createError({
          statusCode: 500,
          statusMessage: 'Query processing failed',
          data: { code, stderr: stderr.substring(0, 500) }
        }))
        return
      }

      try {
        const result = JSON.parse(stdout)
        if (result.error) {
          console.error('Python script returned error:', result)
          reject(createError({
            statusCode: 500,
            statusMessage: result.error,
            data: result
          }))
        } else {
          console.log('Query successful:', { 
            chunks_used: result.chunks_used, 
            summary_length: result.summary?.length || 0 
          })
          resolve(result)
        }
      } catch (e) {
        console.error('Failed to parse Python output:', e)
        console.error('Raw output:', stdout.substring(0, 500))
        reject(createError({
          statusCode: 500,
          statusMessage: 'Invalid response format'
        }))
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('Python process error:', error)
      reject(createError({
        statusCode: 500,
        statusMessage: 'Failed to start Python process',
        data: { error: error.message }
      }))
    })

    // Send input data to Python script
    const input = JSON.stringify({ query, reportName, maxChunks })
    pythonProcess.stdin.write(input)
    pythonProcess.stdin.end()
  })
})
