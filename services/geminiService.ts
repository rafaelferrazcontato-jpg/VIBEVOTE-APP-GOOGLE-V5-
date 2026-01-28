import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Standard client for Chat
export const getGenAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Veo requires a fresh client possibly with a newly selected key from the window
export const getVeoClient = async () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export type ChatMode = 'standard' | 'thinking' | 'search' | 'maps';

export const sendMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  images: string[] = [], // base64 strings
  mode: ChatMode = 'standard',
  location?: { lat: number, lng: number }
): Promise<{ text: string; groundingMetadata?: any }> => {
  const ai = getGenAIClient();
  
  let model = 'gemini-3-flash-preview';
  let config: any = {};

  if (mode === 'thinking') {
    model = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 32768 };
  } else if (mode === 'search') {
    model = 'gemini-3-flash-preview';
    config.tools = [{ googleSearch: {} }];
  } else if (mode === 'maps') {
    model = 'gemini-2.5-flash';
    config.tools = [{ googleMaps: {} }];
    if (location) {
        config.toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.lat,
                    longitude: location.lng
                }
            }
        };
    }
  } else if (images.length > 0) {
      // General Image Generation/Editing Tasks or Multimodal chat about images
      // Using 2.5 flash image as per spec for general image tasks/editing
      model = 'gemini-2.5-flash-image';
  } else {
     // Basic text tasks
     model = 'gemini-3-flash-preview';
  }

  try {
    const parts: any[] = [];
    
    // Add images if any
    images.forEach(img => {
      const match = img.match(/^data:(.+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const base64Data = match ? match[2] : img;
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    });

    parts.push({ text: newMessage });

    const chat = ai.chats.create({
      model: model,
      config: config,
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result: GenerateContentResponse = await chat.sendMessage({ 
        message: images.length > 0 ? { role: 'user', parts } : newMessage 
    });
    
    return {
        text: result.text || "No response text.",
        groundingMetadata: result.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
};

export const generateImage = async (prompt: string, size: '1K'|'2K'|'4K', aspectRatio: string): Promise<string> => {
    const ai = getGenAIClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    imageSize: size,
                    aspectRatio: aspectRatio as any
                }
            }
        });
        
        // Find image part
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return "";
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getGenAIClient();
    try {
        const match = base64Image.match(/^data:(.+);base64,(.+)$/);
        const mimeType = match ? match[1] : 'image/png';
        const base64Data = match ? match[2] : base64Image;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return "";
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const generateVideo = async (prompt: string): Promise<any> => {
    // Veo generation logic
    const ai = await getVeoClient();
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
        
        return operation;

    } catch (e) {
        throw e;
    }
}

export const pollVideoOperation = async (operation: any): Promise<any> => {
    const ai = await getVeoClient();
    return await ai.operations.getVideosOperation({ operation });
}