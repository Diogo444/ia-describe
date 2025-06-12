import React, { useCallback, useState } from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Veuillez sélectionner une image JPEG, PNG, GIF ou WebP.');
      return false;
    }

    if (file.size > maxSize) {
      setError('Fichier trop volumineux. La taille maximale est de 10MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const input = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      input?.click();
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-4 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          focus-within:ring-4 focus-within:ring-blue-500 focus-within:ring-opacity-25
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label="Zone de dépôt pour sélectionner une image. Appuyez sur Entrée ou Espace pour ouvrir le sélecteur de fichiers."
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          aria-describedby="file-upload-description"
        />
        
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-blue-100 rounded-full">
            {isLoading ? (
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <Upload className="w-12 h-12 text-blue-600" aria-hidden="true" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {isLoading ? 'Analyse en cours...' : 'Sélectionnez une image'}
            </h3>
            <p id="file-upload-description" className="text-lg text-gray-600">
              {isLoading 
                ? 'Veuillez patienter pendant que l\'IA analyse votre image'
                : 'Glissez-déposez une image ici ou cliquez pour sélectionner'
              }
            </p>
            <p className="text-sm text-gray-500">
              Formats supportés : JPEG, PNG, GIF, WebP (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};