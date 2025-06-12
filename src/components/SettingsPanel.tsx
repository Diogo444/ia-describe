import React from 'react';
import { Settings, Volume2 } from 'lucide-react';
import { SpeechSettings, DetailLevel } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  settings: SpeechSettings;
  onSettingsChange: (settings: SpeechSettings) => void;
  voices: SpeechSynthesisVoice[];
  detailLevel: DetailLevel;
  onDetailLevelChange: (level: DetailLevel) => void;
  onTestSpeech: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onToggle,
  settings,
  onSettingsChange,
  voices,
  detailLevel,
  onDetailLevelChange,
  onTestSpeech
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
        aria-expanded={isOpen}
        aria-controls="settings-content"
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-gray-600" aria-hidden="true" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paramètres</span>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {isOpen && (
        <div id="settings-content" className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
          <div>
            <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voix
            </label>
            <select
              id="voice-select"
              value={settings.voice}
              onChange={(e) => onSettingsChange({ ...settings, voice: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25 focus:border-blue-500"
            >
              <option value="">Voix par défaut</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vitesse de lecture : {settings.rate.toFixed(1)}
            </label>
            <input
              id="rate-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.rate}
              onChange={(e) => onSettingsChange({ ...settings, rate: parseFloat(e.target.value) })}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
            />
          </div>

          <div>
            <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hauteur de la voix : {settings.pitch.toFixed(1)}
            </label>
            <input
              id="pitch-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => onSettingsChange({ ...settings, pitch: parseFloat(e.target.value) })}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
            />
          </div>

          <div>
            <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume : {Math.round(settings.volume * 100)}%
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => onSettingsChange({ ...settings, volume: parseFloat(e.target.value) })}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
            />
          </div>

          <div>
            <label htmlFor="detail-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niveau de détail
            </label>
            <select
              id="detail-select"
              value={detailLevel}
              onChange={(e) => onDetailLevelChange(e.target.value as DetailLevel)}
              className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25 focus:border-blue-500"
            >
              <option value="rapide">Rapide</option>
              <option value="moyenne">Moyenne</option>
              <option value="detaillee">Détaillée</option>
            </select>
          </div>

          <button
            onClick={onTestSpeech}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
          >
            <Volume2 className="w-5 h-5" aria-hidden="true" />
            <span>Tester la voix</span>
          </button>
        </div>
      )}
    </div>
  );
};