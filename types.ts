export type Language = 'PT' | 'EN' | 'ES';

export interface Artist {
  id: number;
  name: string;
  genre: string;
  img: string;
  audio: string;
  votes: number;
  desc: string;
  status: string;
  in_lineup: boolean;
}

export interface Reward {
  title: string;
  cost: number;
  icon: string;
  desc?: string;
  active?: boolean;
}

export interface UserState {
  isLoggedIn: boolean;
  xp: number;
  votedArtistIds: number[];
  language: Language;
  showProfile: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  images?: string[];
  groundingMetadata?: any;
}

export type ViewMode = 'VOTE' | 'DASHBOARD' | 'CHAT' | 'LIVE' | 'IMAGE' | 'VEO';