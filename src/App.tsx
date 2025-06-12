import React, { useState, useCallback } from 'react';
import { Eye, History, Settings as SettingsIcon } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DescriptionCard } from './components/DescriptionCard';
import { SettingsPanel } from './components/SettingsPanel';
import { useSpeech } from './hooks/useSpeech';
import { useGemini } from './hooks/useGemini';
import { ImageDescription } from './types';

function App() {
  const [descriptions, setDescriptions] = useState<ImageDescription[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { speak, stop, isSpeaking, isSupported, voices, settings, setSettings } = useSpeech();
  const { describeImage, isLoading, error } = useGemini();

  const handleFileSelect = useCallback(async (file: File) => {
    const newDescription: ImageDescription = {
      id: Date.now().toString(),
      fileName: file.name,
      description: '',
      timestamp: new Date(),
      isLoading: true
    };

    setDescriptions(prev => [newDescription, ...prev]);
    
    // Announce that analysis is starting
    speak(`Analyse de l'image ${file.name} en cours. Veuillez patienter.`);

    try {
      const description = await describeImage(file);
      
      setDescriptions(prev => 
        prev.map(desc => 
          desc.id === newDescription.id 
            ? { ...desc, description, isLoading: false }
            : desc
        )
      );
      
      // Automatically read the description when ready
      setTimeout(() => {
        speak(`Description de l'image ${file.name} : ${description}`);
      }, 500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setDescriptions(prev =>
        prev.map(desc =>
          desc.id === newDescription.id
            ? { ...desc, description: 'Erreur lors de l\'analyse de l\'image.', isLoading: false }
            : desc
        )
      );
      speak(`Une erreur est survenue lors de l'analyse de l'image: ${errorMessage}`);
    }
  }, [describeImage, speak]);

  const handleTestSpeech = useCallback(() => {
    speak('Ceci est un test de la synthèse vocale. Bonjour et bienvenue dans l\'application de description d\'images accessible.');
  }, [speak]);

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'h':
          event.preventDefault();
          setShowHistory(!showHistory);
          speak(showHistory ? 'Historique masqué' : 'Historique affiché');
          break;
        case 's':
          event.preventDefault();
          setShowSettings(!showSettings);
          speak(showSettings ? 'Paramètres masqués' : 'Paramètres affichés');
          break;
        case 'Escape':
          if (isSpeaking) {
            stop();
          }
          break;
      }
    }
  }, [showHistory, showSettings, isSpeaking, speak, stop]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  // Announce the app when it loads
  React.useEffect(() => {
    const timer = setTimeout(() => {
      speak('Application de description d\'images accessible chargée. Vous pouvez sélectionner une image pour obtenir sa description.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Aller au contenu principal
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Description d'Images IA
                </h1>
                <p className="text-lg text-gray-600">
                  Application accessible avec Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
                aria-label="Afficher l'historique (Ctrl+H)"
                title="Historique (Ctrl+H)"
              >
                <History className="w-6 h-6 text-gray-600" aria-hidden="true" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25"
                aria-label="Ouvrir les paramètres (Ctrl+S)"
                title="Paramètres (Ctrl+S)"
              >
                <SettingsIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload section */}
          <section aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="text-2xl font-bold text-gray-900 mb-6">
              Sélectionner une image à analyser
            </h2>
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </section>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4" role="alert">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Settings panel */}
          {showSettings && isSupported && (
            <section aria-labelledby="settings-heading">
              <h2 id="settings-heading" className="sr-only">Paramètres de synthèse vocale</h2>
              <SettingsPanel
                isOpen={showSettings}
                onToggle={() => setShowSettings(!showSettings)}
                settings={settings}
                onSettingsChange={setSettings}
                voices={voices}
                onTestSpeech={handleTestSpeech}
              />
            </section>
          )}

          {/* Speech not supported warning */}
          {!isSupported && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4" role="alert">
              <p className="text-yellow-800">
                La synthèse vocale n'est pas disponible dans votre navigateur. 
                Les descriptions seront affichées uniquement en texte.
              </p>
            </div>
          )}

          {/* Descriptions section */}
          {descriptions.length > 0 && (
            <section aria-labelledby="descriptions-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="descriptions-heading" className="text-2xl font-bold text-gray-900">
                  {showHistory ? 'Historique des descriptions' : 'Description récente'}
                </h2>
                {descriptions.length > 1 && (
                  <p className="text-gray-600">
                    {descriptions.length} image{descriptions.length > 1 ? 's' : ''} analysée{descriptions.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {(showHistory ? descriptions : descriptions.slice(0, 1)).map((description) => (
                  <DescriptionCard
                    key={description.id}
                    description={description}
                    onSpeak={speak}
                    onStopSpeech={stop}
                    isSpeaking={isSpeaking}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Instructions */}
          <section aria-labelledby="instructions-heading" className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 id="instructions-heading" className="text-xl font-bold text-blue-900 mb-4">
              Instructions d'utilisation
            </h2>
            <div className="space-y-2 text-blue-800">
              <p>• <strong>Sélectionner une image :</strong> Cliquez sur la zone de dépôt ou glissez-déposez une image</p>
              <p>• <strong>Navigation clavier :</strong> Utilisez Tab pour naviguer, Entrée/Espace pour activer</p>
              <p>• <strong>Raccourcis :</strong> Ctrl+H (historique), Ctrl+S (paramètres), Échap (arrêter la lecture)</p>
              <p>• <strong>Formats supportés :</strong> JPEG, PNG, GIF, WebP (maximum 10MB)</p>
              <p>• <strong>Synthèse vocale :</strong> Les descriptions sont lues automatiquement</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            Application conçue pour l'accessibilité - Compatible avec les lecteurs d'écran
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;