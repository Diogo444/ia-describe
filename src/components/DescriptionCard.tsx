import React from 'react';
import { Volume2, VolumeX, Clock, Image } from 'lucide-react';
import { ImageDescription } from '../types';

interface DescriptionCardProps {
  description: ImageDescription;
  onSpeak: (text: string) => void;
  onStopSpeech: () => void;
  isSpeaking: boolean;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({
  description,
  onSpeak,
  onStopSpeech,
  isSpeaking
}) => {
  const handleSpeakClick = () => {
    if (isSpeaking) {
      onStopSpeech();
    } else {
      onSpeak(description.description);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSpeakClick();
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Image className="w-6 h-6 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {description.fileName}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <time dateTime={description.timestamp.toISOString()}>
                {description.timestamp.toLocaleString('fr-FR')}
              </time>
            </div>
          </div>
        </div>

        <button
          onClick={handleSpeakClick}
          onKeyDown={handleKeyPress}
          className={`
            p-3 rounded-full transition-colors focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25
            ${isSpeaking 
              ? 'bg-red-100 hover:bg-red-200 text-red-600' 
              : 'bg-green-100 hover:bg-green-200 text-green-600'
            }
          `}
          aria-label={isSpeaking ? 'Arrêter la lecture' : 'Lire la description'}
          title={isSpeaking ? 'Arrêter la lecture' : 'Lire la description'}
        >
          {isSpeaking ? (
            <VolumeX className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {description.description}
        </p>
      </div>

      {description.isLoading && (
        <div className="mt-4 flex items-center space-x-2 text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="text-sm font-medium">Génération de la description...</span>
        </div>
      )}
    </div>
  );
};