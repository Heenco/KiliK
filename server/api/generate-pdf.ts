import puppeteer from 'puppeteer'
import { defineEventHandler, getQuery, getHeader, setResponseHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  let browser = null
  
  try {
    const query = getQuery(event)
    const { address, lat, lng } = query

    console.log('PDF generation request:', { address, lat, lng })

    // Validate required parameters
    if (!address) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: address'
      })
    }

    // Launch browser
    console.log('Launching Puppeteer browser...')
    browser = await puppeteer.launch({
      headless: true, // Use headless mode for better reliability
      timeout: 60000, // Increase timeout to 60 seconds
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--remote-debugging-address=127.0.0.1', // Force IPv4
        '--remote-debugging-port=0', // Let Chrome choose an available port
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-default-apps',
        '--disable-sync',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-component-extensions-with-background-pages'
      ]
    })
    console.log('Browser launched successfully')

    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 })

    // Get the base URL for the current request
    const host = getHeader(event, 'host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`

    // Navigate to the PDF-optimized report page
    const reportUrl = `${baseUrl}/PDF_report/pdf?address=${encodeURIComponent(String(address))}&lat=${lat || ''}&lng=${lng || ''}`
    
    console.log('Navigating to:', reportUrl)
    
    await page.goto(reportUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    })

    // Wait a bit for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { 
        top: '20mm', 
        bottom: '20mm', 
        left: '15mm', 
        right: '15mm' 
      }
    })

    await browser.close()
    browser = null

    console.log('PDF generated successfully, size:', pdf.length, 'bytes')

    // Convert PDF buffer to base64 to prevent corruption during transmission
    const base64Pdf = Buffer.from(pdf).toString('base64')
    console.log('PDF converted to base64, length:', base64Pdf.length)

    // Set response headers for JSON response containing base64 data
    setResponseHeader(event, 'Content-Type', 'application/json')
    
    // Return the PDF as base64 in JSON format
    return {
      success: true,
      pdf: base64Pdf,
      filename: 'property-report.pdf',
      size: pdf.length
    }

  } catch (error: any) {
    console.error('PDF generation error:', error)
    
    // Ensure browser is closed in case of error
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `PDF generation failed: ${error.message}`
    })
  }
})
