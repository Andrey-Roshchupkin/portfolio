export interface WebAIStatus {
  isAvailable: boolean;
  isChrome: boolean;
  chromeVersion: number | null;
  message: string;
  instructions: string[];
  availability: 'readily' | 'available' | 'downloading' | 'downloadable' | 'unavailable' | 'checking';
}

export type InitState = 'idle' | 'initializing' | 'initialized';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // Base64 or URL
}

