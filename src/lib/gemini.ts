import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const enhancePrompt = async (userPrompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an AI assistant specialized in enhancing user prompts to make them more detailed, specific, and effective. Take the following user prompt and enhance it to be more comprehensive while maintaining the original intent. Return ONLY the enhanced prompt, nothing else:

"${userPrompt}"`,
  });

  return response.text || 'Failed to enhance prompt.';
};
