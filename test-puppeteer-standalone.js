import puppeteer from 'puppeteer';

async function testPuppeteer() {
  console.log('🚀 Starting Puppeteer test...');
  
  try {
    // Test 1: Check if we can get the executable path
    console.log('Step 1: Checking Chrome executable...');
    try {
      const executablePath = puppeteer.executablePath();
      console.log('✓ Chrome executable found at:', executablePath);
    } catch (e) {
      console.log('❌ No Chrome executable found:', e.message);
    }

    // Test 2: Try to launch browser
    console.log('Step 2: Launching browser...');
    const browser = await puppeteer.launch({
      headless: true, // Use headless mode for better reliability
      timeout: 60000, // Increase timeout to 60 seconds
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--remote-debugging-address=127.0.0.1', // Force IPv4
        '--remote-debugging-port=0', // Let Chrome pick available port
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-component-extensions-with-background-pages'
      ]
    });
    console.log('✓ Browser launched successfully!');

    // Test 3: Create a page
    console.log('Step 3: Creating new page...');
    const page = await browser.newPage();
    console.log('✓ Page created successfully!');

    // Test 4: Set some content
    console.log('Step 4: Setting page content...');
    await page.setContent('<h1>Hello World!</h1><p>Puppeteer is working!</p>');
    console.log('✓ Content set successfully!');

    // Test 5: Generate PDF
    console.log('Step 5: Generating PDF...');
    const pdf = await page.pdf({ 
      format: 'A4',
      path: 'test-output.pdf' // Save to file
    });
    console.log('✓ PDF generated successfully! Size:', pdf.length, 'bytes');
    console.log('✓ PDF saved to: test-output.pdf');

    // Clean up
    await browser.close();
    console.log('✓ Browser closed successfully!');
    
    console.log('🎉 All tests passed! Puppeteer is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    
    // Check common issues
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Suggestion: Chrome might not be installed or accessible');
    }
    if (error.message.includes('spawn')) {
      console.log('💡 Suggestion: Check if Chrome executable exists and has proper permissions');
    }
    if (error.message.includes('EADDRINUSE')) {
      console.log('💡 Suggestion: Another Chrome instance might be running on the debugging port');
    }
  }
}

testPuppeteer();
