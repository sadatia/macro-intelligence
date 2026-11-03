import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://tabitoken.com/v1',
  apiKey: 'sk-kZkQ8RH6i3MkdPImUCvCCklrD3VrNh7WpFquOACIk6I80A7x',
});

async function main() {
  const completion = await client.chat.completions.create({
    model: 'claude-opus-5-thinking',
    messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
  });

  console.log('Response:', completion.choices[0].message.content);
}

main().catch(console.error);