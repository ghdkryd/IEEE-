export interface Slide {
  title: string;
  content: string;
  bulletPoints: string[];
  layout: 'title' | 'bullet' | 'split' | 'quote';
  imagePrompt?: string; // Optional prompt for an image if we were to generate one
}

export interface NavigationItem {
  name: string;
  path: string;
}

// Keeping these for legacy compatibility if needed, though they aren't used in the new flow
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}