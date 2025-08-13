
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
    
    console.log('Environment detection:', { host, isVercel, reportUrl })

    if (isVercel) {
      // Use PDFShift
      console.log('Using PDFShift for PDF generation')
      try {
        const pdfResponse = await axios.post(
          'https://api.pdfshift.io/v3/convert/pdf',
          { source: reportUrl },
          {
            responseType: 'arraybuffer',
            headers: {
              'X-API-Key': 'sk_df68be4d7abaf209766e41987cf8a1b297bdfe78'
            }
          }
        )
        
        // Check if response is actually a PDF
        if (pdfResponse.headers['content-type']?.includes('application/pdf')) {
          const pdfBuffer = Buffer.from(pdfResponse.data)
          console.log('PDFShift success, PDF size:', pdfBuffer.length)
          setResponseHeader(event, 'Content-Type', 'application/pdf')
          setResponseHeader(event, 'Content-Disposition', 'attachment; filename=property-report.pdf')
          return pdfBuffer
        } else {
          // PDFShift returned an error (probably JSON)
          const errorText = Buffer.from(pdfResponse.data).toString()
          console.error('PDFShift error response:', errorText)
          throw new Error(`PDFShift error: ${errorText}`)
        }
      } catch (axiosError: any) {
        console.error('PDFShift request failed:')
        console.error('Status:', axiosError.response?.status)
        console.error('Status Text:', axiosError.response?.statusText)
        console.error('Headers:', axiosError.response?.headers)
        console.error('Data:', axiosError.response?.data)
        console.error('Message:', axiosError.message)
        
        // Try to get more details from the response
        if (axiosError.response?.data) {
          const errorDetails = Buffer.from(axiosError.response.data).toString()
          console.error('PDFShift error details:', errorDetails)
        }
        
        throw new Error(`PDFShift failed: ${axiosError.message}`)
      }
    } else {
      // Proxy to local Puppeteer function
      console.log('Using local Puppeteer for PDF generation')
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
  } catch (error: any) {
    console.error('PDF generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `PDF generation failed: ${error.message}`
    })
  }
})
