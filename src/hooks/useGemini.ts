import { useState, useCallback } from 'react';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const describeImage = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Note: In a real implementation, you would need to:
      // 1. Set up environment variables for Gemini API key
      // 2. Use a backend service to make the API call for security
      // For this demo, we'll simulate the API response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response based on common image types
      const mockDescriptions = [
        "Cette image montre une scène extérieure avec un ciel bleu dégagé. On peut voir des arbres verdoyants au premier plan et des bâtiments en arrière-plan. La lumière naturelle suggère que la photo a été prise en milieu de journée.",
        "L'image présente un portrait d'une personne souriante. La personne porte des vêtements décontractés et se trouve dans un environnement intérieur bien éclairé. L'arrière-plan semble être flou, mettant l'accent sur le sujet principal.",
        "Cette photographie capture un paysage naturel avec des montagnes au loin. Au premier plan, on observe de la végétation et ce qui semble être un sentier. Les couleurs dominantes sont le vert de la nature et le bleu du ciel.",
        "L'image montre un objet ou un produit sur un fond neutre. L'éclairage est uniforme, suggérant qu'il s'agit d'une photo de produit ou d'une image destinée à un usage commercial.",
        "Cette image contient du texte ou des éléments graphiques. Il pourrait s'agir d'un document, d'une affiche ou d'une capture d'écran avec des informations textuelles visibles."
      ];

      const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      
      return `Description détaillée : ${randomDescription} L'image a une taille approximative de ${Math.round(file.size / 1024)} KB et est au format ${file.type.split('/')[1]}.`;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de l'analyse de l'image : ${errorMessage}`);
      throw new Error(errorMessage);
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