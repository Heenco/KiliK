import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  try {
    // Get the query parameter
    const query = getQuery(event);
    console.log('Received query parameters:', query);
    const address = query.q as string;
    console.log('Address to search:', address);

    // Validate address parameter
    if (!address) {
      console.log('Error: Missing address parameter');
      return {
        statusCode: 400,
        body: { error: 'Address query parameter (q) is required' }
      };
    }

    // SerpAPI key - replace with your actual API key
    const apiKey = '752783a29a092eb9d192af062226569fe0c13b39e24837babb6f0f0d0a5a4338';
    
    // Construct the URL for SerpAPI
    const url = `https://serpapi.com/search`;
    
    // Prepare SerpAPI parameters
    const params = {
      api_key: apiKey,
      q: `${address} property information`,
      engine: 'google',
      num: 10,  // Number of results to return
      gl: 'au', // Location (Australia)
      google_domain: 'google.com.au'
    };
    
    console.log('Sending request to SerpAPI with params:', {...params, api_key: '***'});

    // Make the request to SerpAPI
    console.log('Sending request to URL:', url);
    const response = await axios.get(url, { params });
    console.log('Received response status:', response.status);
    
    // Extract relevant information from the response
    const results = response.data;
    console.log('Response data structure:', Object.keys(results));
    
    // Define interface for SerpAPI organic result
    interface SerpApiResult {
      position?: number;
      title?: string;
      link?: string;
      snippet?: string;
      displayed_link?: string;
      [key: string]: any; // For any other properties
    }
    
    // Create a simplified response with only essential information
    const organicResults = results.organic_results || [];
    const simplifiedMatches = organicResults.map((result: SerpApiResult) => ({
      title: result.title || 'No title',
      url: result.link || '',
      snippet: result.snippet || '',
      position: result.position || 0
    }));
    
    // Return processed simplified results
    return {
      address: address,
      matches: simplifiedMatches,
      search_time: results.search_time_elapsed || null
    };    } catch (error) {
    console.error('Error fetching property information from SerpAPI:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
      // Return error response
    return {
      error: 'Failed to fetch property information',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});
