// FIX: Corrected import typo from GoogleGenerAI to GoogleGenAI
import { GoogleGenAI, Modality, Part } from "@google/genai";

// Utility function to convert a remote image URL to a Part
export async function urlToGenerativePart(url: string, mimeType: string): Promise<Part> {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

// FIX: Update function to accept an API key, removing reliance on process.env.
export const generateImage = async (
  apiKey: string,
  prompt: string,
  imagePart: Part
): Promise<string | null> => {
  try {
    // FIX: Instantiate GoogleGenAI with the provided apiKey for each request.
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash-image-preview';

    const textPart = {
      text: `Given the user's image, apply the following changes while preserving the original perspective and overall structure of the room. Changes: "${prompt}"`
    };
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    // FIX: Add specific error handling for invalid API keys.
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error('Your Gemini API key is not valid. Please check it and try again.');
    }
    throw new Error("Failed to generate the image. Please check the prompt or try a different image.");
  }
};
