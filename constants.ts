import { Event, TeamMember, Project, BlogPost, NavigationItem } from './types';

export const ORG_NAME = "IEEE Tech University Branch";
export const MISSION = "To foster technological innovation and excellence for the benefit of humanity.";

export const NAV_ITEMS: NavigationItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Activities', path: '/activities' },
  { name: 'Events', path: '/events' },
  { name: 'Team', path: '/team' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Join Us', path: '/join' },
  { name: 'Contact', path: '/contact' },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Intro to Gemini API',
    date: '2023-11-15',
    description: 'Learn how to build next-gen AI apps using Google\'s Gemini models.',
    location: 'Engineering Hall B',
    image: 'https://picsum.photos/800/400?random=1',
    category: 'Workshop'
  },
  {
    id: '2',
    title: 'Annual Hackathon',
    date: '2023-12-01',
    description: '24-hour coding marathon to solve real-world problems.',
    location: 'Student Center',
    image: 'https://picsum.photos/800/400?random=2',
    category: 'Competition'
  },
  {
    id: '3',
    title: 'Industry Talk: Green Tech',
    date: '2023-11-20',
    description: 'A seminar on sustainable energy solutions by industry leaders.',
    location: 'Virtual (Zoom)',
    image: 'https://picsum.photos/800/400?random=3',
    category: 'Seminar'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Chairperson',
    bio: 'Computer Engineering senior passionate about AI and community building.',
    image: 'https://picsum.photos/200/200?random=10',
    committee: 'Board'
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Technical Lead',
    bio: 'Full-stack developer and open source enthusiast.',
    image: 'https://picsum.photos/200/200?random=11',
    committee: 'Technical'
  },
  {
    id: '3',
    name: 'Amara Okafor',
    role: 'Media Head',
    bio: 'Creative designer focusing on UI/UX and digital marketing.',
    image: 'https://picsum.photos/200/200?random=12',
    committee: 'Media'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'HR Director',
    bio: 'Ensuring member satisfaction and team cohesion.',
    image: 'https://picsum.photos/200/200?random=13',
    committee: 'HR'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Assistant',
    description: 'An AI-powered chatbot helping students navigate campus facilities.',
    image: 'https://picsum.photos/600/400?random=20',
    outcome: 'Deployed on university website'
  },
  {
    id: '2',
    title: 'Solar Tracker',
    description: 'Arduino-based dual-axis solar tracker for maximizing energy efficiency.',
    image: 'https://picsum.photos/600/400?random=21',
    outcome: '1st Place in Regional Robotics Fair'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why You Should Join a Student Branch',
    excerpt: 'Networking, skills, and fun - here is why IEEE is the place to be.',
    date: 'Oct 25, 2023',
    author: 'Sarah Jenkins',
    category: 'Community'
  },
  {
    id: '2',
    title: 'Understanding React 18 Concurrency',
    excerpt: 'A deep dive into the new features of React 18 and how they improve UX.',
    date: 'Nov 02, 2023',
    author: 'David Chen',
    category: 'Technical'
  }
];