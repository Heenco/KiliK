const fs = require('fs')
const path = require('path')

const tryCopy = (srcRel, dest) => {
  try {
    const src = path.resolve(process.cwd(), srcRel)
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
      console.log('Copied', srcRel, '->', dest)
      return true
    }
  } catch (e) {
    // ignore
  }
  return false
}

const publicDir = path.resolve(process.cwd(), 'public')
const destMjs = path.join(publicDir, 'pdf.worker.min.mjs')
const destJs = path.join(publicDir, 'pdf.worker.min.js')

// try legacy mjs then built js
if (tryCopy('node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs', destMjs)) process.exit(0)
if (tryCopy('node_modules/pdfjs-dist/build/pdf.worker.min.js', destJs)) process.exit(0)

// fallback: log helpful message
console.warn('pdf.worker not found in node_modules: expected pdfjs-dist package. Please install pdfjs-dist and re-run npm install.')
process.exit(0)
