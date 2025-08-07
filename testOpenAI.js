import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

const testOpenAI = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, OpenAI!' }],
    });

    console.log('OpenAI Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
  }
};

testOpenAI();
