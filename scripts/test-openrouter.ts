import OpenAI from 'openai';

const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Error: AI_API_KEY is not defined in your environment.');
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
});

async function testOpenRouter() {
  console.log('Testing OpenRouter Llama 3.1 8B Instruct Connection...');
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'user', content: 'In one concise sentence, explain why non-farm payroll surprises move the US Dollar.' }
      ],
    });
    console.log('\nAI Response Success:');
    console.log(response.choices[0]?.message?.content);
  } catch (err: any) {
    console.error('OpenRouter Test Failed:', err.message);
  }
}

testOpenRouter();
