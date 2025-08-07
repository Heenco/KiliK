# OpenAI Integration for Inspection Reports

This application uses OpenAI's GPT-4 API to analyze inspection reports and categorize issues as major or minor.

## Setup

To enable the OpenAI integration, you need to provide your own API key:

1. Sign up for an OpenAI account at [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an API key in your OpenAI dashboard
3. Copy your API key
4. Open the `.env` file in the root of the project
5. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```
OPENAI_API_KEY=your_actual_key_here
```

## Security

- Never commit your API key to version control
- The `.env` file is already included in `.gitignore`
- For production, set the environment variable in your hosting provider's dashboard

## Troubleshooting

If you encounter issues with the OpenAI integration:

1. Check that your API key is correctly set in the `.env` file
2. Ensure your OpenAI account has sufficient credits
3. Check if the GPT-4 model is available for your account
4. Review the browser console and server logs for specific error messages

## Notes

- The application uses the GPT-4 model, which has token limits
- Large inspection reports may be truncated to fit within these limits
- API responses might vary in format and quality depending on the input text
