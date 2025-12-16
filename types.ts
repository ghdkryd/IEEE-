export type Theme = 'neo' | 'cyber' | 'corporate' | 'minimal';

export interface Slide {
  title: string;
  content: string;
  bulletPoints: string[];
  layout: 'title' | 'bullet' | 'split' | 'quote' | 'image-center';
  imagePrompt: string; // Required now for AI image generation
}

export interface NavigationItem {
  name: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}