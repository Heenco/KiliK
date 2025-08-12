import puppeteer from 'puppeteer'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  let browser: any = null
  const startTime = Date.now()
  
  try {
    console.log('=== Starting Simple Puppeteer test ===')
    
    // Get the Chrome executable path
    let executablePath
    try {
      executablePath = puppeteer.executablePath()
      console.log('✓ Chrome executable found at:', executablePath)
    } catch (e: any) {
      console.log('❌ Chrome executable not found:', e.message)
      throw new Error('Chrome executable not found')
    }

    // Add a global timeout for the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Overall operation timeout after 30 seconds')), 30000)
    })
    
    const testPromise = async () => {
      console.log('Step 1: Launching browser with explicit path...')
      browser = await puppeteer.launch({
        executablePath: executablePath,
        headless: true,
        timeout: 15000, // Shorter timeout
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--remote-debugging-address=127.0.0.1',
          '--remote-debugging-port=0',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      })
      console.log('✓ Browser launched successfully')

      console.log('Step 2: Creating page and generating PDF...')
      const page = await browser.newPage()
      await page.setContent('<h1>Server Test</h1><p>PDF generation working!</p>')
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true
      })
      console.log('✓ PDF generated, size:', pdf.length, 'bytes')

      await browser.close()
      browser = null
      console.log('✓ Browser closed')
      
      return pdf
    }
    
    // Race between the test and timeout
    const pdf = await Promise.race([testPromise(), timeoutPromise])

    // Set response headers
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', 'attachment; filename="server-test.pdf"')
    
    const duration = Date.now() - startTime
    console.log(`✓ Test completed in ${duration}ms`)
    
    return pdf

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`❌ Test failed after ${duration}ms:`, error.message)
    
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    // Return JSON error
    setHeader(event, 'Content-Type', 'application/json')
    
    return { 
      error: true, 
      message: error.message,
      duration: duration
    }
  }
})
