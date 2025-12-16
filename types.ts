export type Theme = 'neo' | 'cyber' | 'corporate' | 'minimal' | 'tech' | 'lux' | 'nature' | 'gradient' | 'geometric' | 'paper' | 'dark-modern' | 'swiss' | 'retro' | 'bauhaus';

export type FontKey = 'cairo' | 'tajawal' | 'amiri' | 'inter' | 'grotesk' | 'playfair' | 'mono';

export interface Slide {
  title: string;
  content: string;
  bulletPoints: string[];
  layout: 'title' | 'bullet' | 'split' | 'quote' | 'focus';
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