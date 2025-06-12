import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGeminiSpeech = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    if (audio) {
      audio.pause();
      setAudio(null);
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-tts' });

    const result = await model.generateContent({
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const data = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) return;

    const audioElement = new Audio(`data:audio/wav;base64,${data}`);
    audioElement.onended = () => {
      setIsSpeaking(false);
      setAudio(null);
    };
    setAudio(audioElement);
    setIsSpeaking(true);
    await audioElement.play();
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsSpeaking(false);
    }
  }, [audio]);

  return { speak, stop, isSpeaking };
};
