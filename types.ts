
export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  sourceUrl: string; // جعلها إجبارية الآن
  timestamp: number;
  aspectRatio: '16:9' | '9:16';
  status: 'pending' | 'completed' | 'failed';
}

export type Resolution = '720p' | '1080p';
export type AspectRatio = '16:9' | '9:16';

export interface VideoConfig {
  resolution: Resolution;
  aspectRatio: AspectRatio;
}
