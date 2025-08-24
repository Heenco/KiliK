import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, '..')
const publicDir = join(projectRoot, 'public')

// Copy PDF.js sandbox file for interactive forms
const sandboxSrc = join(projectRoot, 'node_modules', 'pdfjs-dist', 'build', 'pdf.sandbox.min.js')
const sandboxDest = join(publicDir, 'pdf.sandbox.min.js')

if (existsSync(sandboxSrc)) {
  copyFileSync(sandboxSrc, sandboxDest)
  console.log('✅ Copied pdf.sandbox.min.js')
} else {
  console.log('⚠️  pdf.sandbox.min.js not found in node_modules')
}

console.log('PDF.js files setup complete!')
