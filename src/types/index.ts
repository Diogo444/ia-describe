export interface ImageDescription {
  id: string;
  fileName: string;
  description: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
}