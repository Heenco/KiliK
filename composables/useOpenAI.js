import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
  dangerouslyAllowBrowser: true
});

export const useOpenAI = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are AI Spatial, a helpful assistant that generates Overpass API queries based on user requests for map features.' },
        { role: 'user', content: message },
      ],
    });

    const content = response.choices[0].message.content;

    // Extract Overpass query from the response
    const queryMatch = content.match(/```(.*?)```/s); // Match content between triple backticks
    const overpassQuery = queryMatch ? queryMatch[1].trim() : null;

    return {
      message: content,
      overpassQuery,
    };
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return {
      message: 'Sorry, I encountered an error.',
      overpassQuery: null,
    };
  }
};
