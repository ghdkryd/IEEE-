export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image: string;
  category: 'Workshop' | 'Seminar' | 'Social' | 'Competition';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  committee: 'Board' | 'Technical' | 'Media' | 'HR';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  outcome: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}

export interface NavigationItem {
  name: string;
  path: string;
}