const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://tabitoken.com/v1',
  apiKey: 'sk-kZkQ8RH6i3MkdPImUCvCCklrD3VrNh7WpFquOACIk6I80A7x',
});

async function runTest() {
  console.log('Sending test request to Tabitoken AI...');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'claude-3-5-sonnet-20240620' / 'gpt-4o'
      messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
    });
    console.log('Success! Response:', response.choices[0].message.content);
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

runTest();