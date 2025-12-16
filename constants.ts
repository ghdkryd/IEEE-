import { NavigationItem, BlogPost } from './types';

export const ORG_NAME = "NeoDeck AI";
export const MISSION = "To democratize design by turning raw ideas into bold, impactful presentations instantly.";

export const NAV_ITEMS: NavigationItem[] = [
  { name: 'Generator', path: '/' },
  { name: 'How it Works', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Brutalist Design',
    excerpt: 'Why bold borders and high contrast are taking over the web.',
    date: 'Oct 25, 2023',
    author: 'NeoDeck Team',
    category: 'Design'
  }
];