export interface Article {
  image_url: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  sentiment: number;
}

export interface HeatmapPoint {
  location: string;
  coordinates: [number, number];
  intensity: number;
}
