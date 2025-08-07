import axios from 'axios';

export const useOverpass = async (query) => {
  try {
    console.log('Query sent to Overpass API:', query); // Log the query being sent

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`, // Encode the query
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Overpass API Response Data:', data);

    const features = [];
    if (data.elements) {
      data.elements.forEach((element) => {
        if (element.type === 'node' && element.lat && element.lon) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.lon, element.lat],
            },
            properties: element.tags || {},
          });
        }
      });
    }

    return features; // Return GeoJSON features
  } catch (error) {
    console.error('Error communicating with Overpass API:', error);
    return null;
  }
};
