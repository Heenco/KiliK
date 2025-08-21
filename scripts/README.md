This folder previously contained a copy script used to copy the pdf.js worker into /public for some deployments.

That script has been removed to keep the repository Vercel-friendly. If you still need to copy a worker for an alternative deployment, create a simple script that copies from node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs to public/pdf.worker.min.mjs and run it during your build step.
