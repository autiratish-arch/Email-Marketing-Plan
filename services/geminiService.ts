import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEmailContent = async (
  industry: string,
  emailTitle: string,
  emailType: string,
  monthTheme: string,
  day: number
): Promise<GeneratedContent> => {
  try {
    const ai = getClient();
    
    const prompt = `
      You are an expert email marketing copywriter specializing in the ${industry} industry.
      
      Task: Create a draft concept for an email in a drip campaign.
      
      Context:
      - Industry: ${industry}
      - Campaign Phase: Month ${monthTheme}
      - Email Type: ${emailTitle} (${emailType})
      - Send Day: Day ${day} of the sequence.

      Please provide:
      1. A catchy Subject Line (max 50 chars).
      2. A brief Body Snippet (2-3 sentences max) capturing the essence.
      3. 3 Bullet points explaining the strategy behind this specific email.
      4. A complete, professional email body draft (150-250 words) ready to send, including standard placeholders like [Name], [Company Name], etc.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            bodySnippet: { type: Type.STRING },
            keyPoints: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            emailBody: { type: Type.STRING }
          },
          required: ["subject", "bodySnippet", "keyPoints", "emailBody"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as GeneratedContent;
      return { ...data, generatedAt: Date.now() };
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};