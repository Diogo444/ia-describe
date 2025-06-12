import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DetailLevel } from '../types';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const describeImage = useCallback(
    async (file: File, level: DetailLevel): Promise<string> => {
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

      const tokenMap: Record<DetailLevel, number> = {
        rapide: 200,
        moyenne: 500,
        detaillee: 1000
      };

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { maxOutputTokens: tokenMap[level] }
      });

      const prompt =
        level === 'rapide'
          ? "Décris brièvement cette image pour une personne malvoyante ou non voyante."
          : level === 'moyenne'
            ? "Décris de manière détaillée mais concise cette image pour une personne malvoyante ou non voyante."
            : "Décris très précisément cette image pour une personne malvoyante ou non voyante.";

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
