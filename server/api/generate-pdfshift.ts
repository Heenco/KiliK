
// Usage: Always call /api/generate-pdfshift from the frontend.
// This endpoint will auto-detect the environment:
// - On Vercel: uses PDFShift API
// - On localhost: proxies to local Puppeteer function
// No need to change frontend logic based on environment.
import axios from 'axios'
import { defineEventHandler, getQuery, getHeader, setResponseHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { address, lat, lng } = query

    if (!address) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: address'
      })
    }

    // Build the URL to render as PDF
    const host = getHeader(event, 'host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`
    const reportUrl = `${baseUrl}/PDF_report/pdf?address=${encodeURIComponent(String(address))}&lat=${lat || ''}&lng=${lng || ''}`

    // Detect if request is from Vercel (by host or header)
    const isVercel = host.includes('vercel.app') || process.env.VERCEL === '1'

    if (isVercel) {
      // Use PDFShift
      const pdfResponse = await axios.post(
        'https://api.pdfshift.io/v3/convert/pdf',
        { source: reportUrl },
        {
          responseType: 'arraybuffer',
          auth: { username: 'sk_df68be4d7abaf209766e41987cf8a1b297bdfe78', password: '' }
        }
      )
      const pdfBuffer = Buffer.from(pdfResponse.data)
      setResponseHeader(event, 'Content-Type', 'application/pdf')
      setResponseHeader(event, 'Content-Disposition', 'attachment; filename=property-report.pdf')
      return pdfBuffer
    } else {
      // Proxy to local Puppeteer function
      // (Assumes your local function is available at /api/generate-pdf)
      const localResponse = await axios.get(
        `${baseUrl}/api/generate-pdf`,
        {
          params: { address, lat, lng },
          responseType: 'arraybuffer'
        }
      )
      setResponseHeader(event, 'Content-Type', 'application/pdf')
      setResponseHeader(event, 'Content-Disposition', 'attachment; filename=property-report.pdf')
      return Buffer.from(localResponse.data)
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `PDF generation failed: ${error.message}`
    })
  }
})
