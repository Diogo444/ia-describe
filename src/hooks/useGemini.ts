import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const describeImage = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
      if (!apiKey) {
        throw new Error('Clé API Gemini manquante');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        // Gemini 1.0 Pro Vision est obsolète ;
        // on utilise à présent le modèle Gemini 2.0 Flash
        model: 'gemini-2.0-flash',
        generationConfig: { maxOutputTokens: 1000 }
      });

      const prompt =
        "Décris précisément cette image pour une personne malvoyante ou non voyante.";

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64
          }
        }
      ]);

      const text = result.response.candidates
        .map(c => c.content.parts.map(p => p.text).join(''))
        .join('');

      return text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de l'analyse de l'image : ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    describeImage,
    isLoading,
    error
  };
};
