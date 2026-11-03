import OpenAI from 'openai';

const aiBaseUrl = process.env.AI_BASE_URL || 'https://tabitoken.com/v1';
const aiApiKey = process.env.AI_API_KEY || '';
const aiModel = process.env.AI_MODEL || 'claude-opus-5-thinking';

const openai = new OpenAI({
  baseURL: aiBaseUrl,
  apiKey: aiApiKey,
});

export interface MacroExplanationParams {
  currency: string;
  score: number;
  classification: string;
  categoryScores: Record<string, number>;
  topDrivers: string[];
  topRisks: string[];
}

export async function generateMacroExplanation(params: MacroExplanationParams): Promise<string> {
  if (!aiApiKey) {
    return 'AI narrative generation disabled: Missing API Key.';
  }

  try {
    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content:
            'You are a quantitative macroeconomist. Provide a concise, professional explanation for the provided deterministic macro score. Do not change or invent numerical values.',
        },
        {
          role: 'user',
          content: `Currency: ${params.currency}
Macro Score: ${params.score} (${params.classification})
Category Breakdown: ${JSON.stringify(params.categoryScores)}
Key Positive Drivers: ${params.topDrivers.join('; ')}
Key Negative Risks: ${params.topRisks.join('; ')}

Explain the primary drivers behind this bias and key upside/downside risks in 3 bullet points.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || 'Unable to generate narrative explanation.';
  } catch (error) {
    console.error('AI Explanation Provider Error:', error);
    return 'Narrative generation currently unavailable. Numerical scoring operates independently.';
  }
}