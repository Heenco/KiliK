import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== Simple API test ===')
    
    // Just return a simple JSON response
    setHeader(event, 'Content-Type', 'application/json')
    
    return {
      success: true,
      message: 'API endpoint is working!',
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('❌ Simple test failed:', error.message)
    
    return {
      error: true,
      message: error.message
    }
  }
})
