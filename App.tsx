import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, MapPin, ChevronRight, Users, Code, Calendar, Award, Check } from 'lucide-react';
import { ORG_NAME, NAV_ITEMS, EVENTS, TEAM, PROJECTS, BLOG_POSTS, MISSION } from './constants';
import { ChatAssistant } from './components/ChatAssistant';
import { Event } from './types';

// --- Navbar Component ---
const Navbar: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 bg-ieee-blue border-2 border-black dark:border-white flex items-center justify-center shadow-neo-sm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-black dark:text-white hidden sm:block uppercase font-sans">IEEE <span className="text-ieee-blue">SB</span></span>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold uppercase tracking-wide px-3 py-1 border-2 border-transparent hover:border-black dark:hover:border-white transition-all ${
                  location.pathname === item.path ? 'bg-neo-yellow dark:bg-ieee-blue border-black dark:border-white shadow-neo-sm text-black dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="p-2 border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white dark:bg-slate-800 text-black dark:text-white"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/join" className="bg-black dark:bg-white hover:bg-ieee-blue dark:hover:bg-neo-yellow text-white dark:text-black border-2 border-black dark:border-white px-5 py-2 text-sm font-bold uppercase shadow-neo dark:shadow-neo-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Join Now
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleDarkMode} className="p-1">
              {darkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black dark:text-white p-2 border-2 border-black dark:border-white shadow-neo-sm"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-neo-yellow dark:bg-slate-800 border-b-4 border-black dark:border-white">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-lg font-bold border-2 border-black dark:border-white shadow-neo-sm ${
                  location.pathname === item.path
                    ? 'bg-ieee-blue text-white'
                    : 'bg-white dark:bg-slate-900 text-black dark:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer Component ---
const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1">
          <div className="inline-block bg-black text-white px-2 py-1 mb-4">
             <h3 className="font-bold text-lg font-sans">{ORG_NAME}</h3>
          </div>
          <p className="text-slate-800 dark:text-slate-300 text-sm leading-relaxed font-medium border-l-4 border-neo-yellow pl-3">
            {MISSION}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider decoration-4 underline decoration-ieee-blue">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
            <li><Link to="/about" className="hover:text-ieee-blue hover:underline">About Us</Link></li>
            <li><Link to="/events" className="hover:text-ieee-blue hover:underline">Events</Link></li>
            <li><Link to="/join" className="hover:text-ieee-blue hover:underline">Membership</Link></li>
            <li><Link to="/contact" className="hover:text-ieee-blue hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider decoration-4 underline decoration-neo-pink">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
            <li className="flex items-center gap-2"><Mail className="text-black dark:text-white" size={18} /> contact@ieee-sb.org</li>
            <li className="flex items-center gap-2"><MapPin className="text-black dark:text-white" size={18} /> Engineering Block, Room 301</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider decoration-4 underline decoration-neo-green">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="p-3 bg-white dark:bg-slate-800 border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"><Github size={20} className="text-black dark:text-white"/></a>
            <a href="#" className="p-3 bg-white dark:bg-slate-800 border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"><Linkedin size={20} className="text-blue-700 dark:text-blue-400"/></a>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-black dark:border-white pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} IEEE Student Branch.</p>
        <p className="bg-neo-yellow text-black px-2">Not officially affiliated with IEEE Global.</p>
      </div>
    </div>
  </footer>
);

// --- Page Components ---

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-neo-yellow dark:bg-slate-800 border-b-4 border-black dark:border-white">
        {/* Abstract Pattern Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block bg-white dark:bg-black border-2 border-black dark:border-white px-4 py-1 mb-6 shadow-neo-sm transform -rotate-2">
            <span className="font-bold text-sm uppercase tracking-widest text-black dark:text-white">Est. 2023 • Tech University</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-black dark:text-white mb-8 tracking-tighter leading-[0.9]">
            EMPOWERING<br/>
            <span className="text-ieee-blue dark:text-ieee-blue relative inline-block">
              FUTURE
              <svg className="absolute w-full h-3 bottom-1 left-0 text-black dark:text-white z-[-1]" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span><br/>
            ENGINEERS
          </h1>
          <p className="text-xl font-medium text-slate-800 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed bg-white/50 dark:bg-black/50 p-4 border-2 border-transparent backdrop-blur-sm">
            Join a vibrant community of innovators. We bridge the gap between academic theory and industry reality with <span className="font-bold underline">code</span>, <span className="font-bold underline">hardware</span>, and <span className="font-bold underline">pizza</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/join" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-bold text-xl uppercase shadow-neo dark:shadow-neo-white hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Join The Club
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-white font-bold text-xl uppercase shadow-neo dark:shadow-neo-white hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <h2 className="text-5xl font-bold text-black dark:text-white uppercase tracking-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-ieee-blue to-purple-600">IEEE SB?</span>
          </h2>
          <div className="h-4 bg-black dark:bg-white flex-grow ml-8 pattern-diagonal-lines opacity-20 hidden md:block"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Code, title: "Technical Workshops", desc: "Hands-on coding, hardware, and robotics sessions.", color: "bg-neo-pink" },
            { icon: Users, title: "Networking", desc: "Connect with industry professionals and alumni.", color: "bg-neo-green" },
            { icon: Award, title: "Career Growth", desc: "Resume reviews, mock interviews, and mentorship.", color: "bg-neo-purple" }
          ].map((card, idx) => (
            <div key={idx} className={`relative p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white transition-transform hover:-translate-y-2 bg-white dark:bg-slate-900`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${card.color} border-l-4 border-b-4 border-black dark:border-white flex items-center justify-center`}>
                <card.icon size={28} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 mt-8 font-sans">{card.title}</h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium border-l-4 border-slate-200 dark:border-slate-700 pl-3">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights / Recent Achievements */}
      <section className="bg-neo-green dark:bg-slate-800 py-20 border-y-4 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-bold text-black dark:text-white mb-2 uppercase">Highlights</h2>
              <div className="w-24 h-2 bg-black dark:bg-white"></div>
            </div>
            <Link to="/projects" className="bg-white dark:bg-black text-black dark:text-white px-6 py-2 border-2 border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold flex items-center gap-2">
              View All <ChevronRight size={20} strokeWidth={3}/>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((proj) => (
               <div key={proj.id} className="group bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                <div className="h-48 overflow-hidden border-b-4 border-black dark:border-white relative">
                   <img src={proj.image} alt={proj.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                   <div className="absolute top-2 right-2 bg-neo-yellow text-black text-xs font-bold px-2 py-1 border-2 border-black">
                     FEATURED
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-sans">{proj.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 font-medium">{proj.description}</p>
                  <span className="inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider">
                    {proj.outcome}
                  </span>
                </div>
               </div>
            ))}
             {/* Dynamic Blog Highlight */}
             <div className="group bg-ieee-blue text-white border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                   <div className="inline-block bg-neo-pink text-black text-xs font-bold px-2 py-1 border-2 border-black mb-4">NEW POST</div>
                   <h3 className="text-3xl font-bold mb-4 leading-tight">Latest from the Blog</h3>
                   <p className="mb-8 font-medium border-l-4 border-white pl-3">{BLOG_POSTS[0].title}</p>
                   <Link to="/blog" className="inline-flex items-center gap-2 font-bold bg-white text-black px-4 py-2 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Read Article <ChevronRight size={18}/></Link>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                   <Code size={180} />
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const About: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold text-black dark:text-white mb-6 uppercase tracking-tighter">About Us</h1>
      <div className="w-full h-1 bg-black dark:bg-white mb-8"></div>
      <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        We are a community-driven organization dedicated to bridging the gap between <span className="bg-neo-yellow px-1 text-black">theoretical knowledge</span> and <span className="bg-neo-pink px-1 text-black">practical application</span>.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-12 mb-16">
      <div className="bg-white dark:bg-slate-900 p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white relative">
        <div className="absolute -top-6 -left-2 bg-ieee-blue text-white px-4 py-1 font-bold border-2 border-black dark:border-white">01</div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-4 mt-2">Our Mission</h2>
        <p className="text-slate-700 dark:text-slate-300 font-medium">{MISSION}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white relative">
         <div className="absolute -top-6 -left-2 bg-purple-600 text-white px-4 py-1 font-bold border-2 border-black dark:border-white">02</div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-4 mt-2">Our Vision</h2>
        <p className="text-slate-700 dark:text-slate-300 font-medium">To be the premier technical community empowering students to become world-class engineers and leaders.</p>
      </div>
    </div>

    <div className="bg-neo-yellow p-8 border-4 border-black dark:border-white">
      <h3 className="text-2xl font-bold text-black mb-4 uppercase">Affiliation</h3>
      <p className="text-black font-medium text-lg">
        We are an official student branch of <span className="font-bold underline">IEEE</span> (Institute of Electrical and Electronics Engineers), the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.
      </p>
    </div>
  </div>
);

interface RegistrationModalProps {
  event: Event;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ event, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', universityId: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', universityId: '' });
      }, 2000);
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white text-center">
           <div className="w-20 h-20 bg-neo-green rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 animate-in zoom-in spin-in-12">
             <Check size={40} className="text-black" strokeWidth={3} />
           </div>
           <h3 className="text-2xl font-bold text-black dark:text-white mb-2 uppercase">You're In!</h3>
           <p className="text-slate-600 dark:text-slate-400 font-medium">Successfully registered for {event.title}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white dark:bg-slate-900 w-full max-w-md border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white relative animate-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={24} className="text-black dark:text-white" />
          </button>
          
          <div className="p-8 border-b-4 border-black dark:border-white bg-neo-yellow dark:bg-slate-800">
             <h2 className="text-2xl font-bold text-black dark:text-white uppercase leading-none">Event Registration</h2>
          </div>
          
          <div className="p-8">
             <p className="mb-6 text-slate-600 dark:text-slate-400 font-medium">Registering for: <br/><span className="text-ieee-blue dark:text-neo-pink font-bold text-lg">{event.title}</span></p>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">Full Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-950 focus:outline-none focus:shadow-neo-sm focus:bg-neo-yellow/10 transition-all font-medium dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">Email</label>
                  <input 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    type="email" 
                    className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-950 focus:outline-none focus:shadow-neo-sm focus:bg-neo-yellow/10 transition-all font-medium dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">University ID</label>
                  <input 
                    required 
                    value={formData.universityId}
                    onChange={e => setFormData({...formData, universityId: e.target.value})}
                    type="text" 
                    className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-950 focus:outline-none focus:shadow-neo-sm focus:bg-neo-yellow/10 transition-all font-medium dark:text-white" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full py-4 mt-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-lg uppercase transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {status === 'submitting' ? 'Processing...' : 'Complete Registration'}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16 border-l-8 border-ieee-blue pl-6">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4 uppercase">Events</h1>
        <p className="text-xl font-bold text-slate-600 dark:text-slate-400">Join our workshops, seminars, and social gatherings.</p>
      </div>

      <div className="grid gap-8">
        {EVENTS.map((event) => (
          <div key={event.id} className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white flex flex-col md:flex-row hover:-translate-y-1 transition-transform">
            <div className="md:w-1/3 h-48 md:h-auto relative border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              <div className="absolute top-0 left-0 bg-neo-yellow border-r-4 border-b-4 border-black text-black px-4 py-2 text-sm font-bold uppercase tracking-wider">
                {event.category}
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center flex-1">
              <div className="flex items-center gap-2 text-sm text-white bg-black dark:bg-white dark:text-black w-fit px-3 py-1 font-bold mb-4">
                <Calendar size={14} /> {event.date}
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-3 font-sans uppercase">{event.title}</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-8 font-medium text-lg">{event.description}</p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                  <MapPin size={18} /> {event.location}
                </div>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="px-6 py-3 bg-ieee-blue text-white border-2 border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <RegistrationModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

const Team: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold text-black dark:text-white mb-4 uppercase">The Squad</h1>
      <p className="text-xl font-bold text-slate-600 dark:text-slate-400 bg-neo-green inline-block px-4 py-1 border-2 border-black transform -rotate-1">The passionate individuals driving our community forward.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {TEAM.map((member) => (
        <div key={member.id} className="bg-white dark:bg-slate-900 p-0 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
          <div className="w-full h-64 overflow-hidden border-b-4 border-black dark:border-white bg-slate-200">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-black dark:text-white uppercase">{member.name}</h3>
            <p className="text-ieee-blue font-bold text-sm mb-3 uppercase tracking-wider">{member.role}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 font-medium line-clamp-2">{member.bio}</p>
            <div className="flex justify-center space-x-3">
              <div className="p-2 bg-black text-white hover:bg-neo-yellow hover:text-black border-2 border-black cursor-pointer transition-colors">
                 <Linkedin size={18} />
              </div>
              <div className="p-2 bg-black text-white hover:bg-neo-pink hover:text-black border-2 border-black cursor-pointer transition-colors">
                 <Mail size={18} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Join: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-16">
    <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white">
      <div className="bg-black text-white p-8 text-center border-b-4 border-black dark:border-white">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">Join IEEE Student Branch</h1>
        <p className="text-neo-yellow font-bold font-mono">Unlock your potential. Build the future.</p>
      </div>
      
      <div className="p-8 md:p-12">
        <div className="mb-12 bg-neo-yellow/30 p-6 border-2 border-black dark:border-white">
          <h3 className="font-bold text-xl mb-4 text-black dark:text-white uppercase decoration-4 underline decoration-black">Why Join?</h3>
          <ul className="grid sm:grid-cols-2 gap-4 text-sm font-bold text-slate-800 dark:text-slate-200">
            {['Access to Workshops', 'Global Networking', 'IEEE Magazines', 'Conference Discounts', 'Mentorship Programs', 'Leadership Opportunities'].map(item => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-black dark:bg-white"></div> {item}
              </li>
            ))}
          </ul>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">First Name</label>
              <input type="text" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-800 focus:bg-neo-yellow/20 focus:outline-none focus:shadow-neo-sm transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">Last Name</label>
              <input type="text" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-800 focus:bg-neo-yellow/20 focus:outline-none focus:shadow-neo-sm transition-all font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-1 uppercase">University Email</label>
            <input type="email" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-800 focus:bg-neo-yellow/20 focus:outline-none focus:shadow-neo-sm transition-all font-medium" />
          </div>
          <button className="w-full py-4 bg-ieee-blue hover:bg-black text-white border-2 border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] font-bold text-lg uppercase tracking-wider transition-all">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  </div>
);

const Contact: React.FC = () => (
   <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
           <h1 className="text-6xl font-bold text-black dark:text-white mb-6 uppercase tracking-tighter">Get in Touch</h1>
           <p className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-8 border-l-4 border-black dark:border-white pl-4">Have questions? We have answers. Maybe.</p>
           
           <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 border-2 border-black dark:border-white shadow-neo-sm bg-white dark:bg-slate-900">
                 <div className="p-3 bg-neo-yellow border-2 border-black text-black">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-black dark:text-white uppercase">Visit Us</h3>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">Engineering Building, Room 301<br/>Tech University Campus</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 border-2 border-black dark:border-white shadow-neo-sm bg-white dark:bg-slate-900">
                 <div className="p-3 bg-neo-pink border-2 border-black text-black">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-black dark:text-white uppercase">Email Us</h3>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">contact@ieee-sb.org<br/>partnerships@ieee-sb.org</p>
                 </div>
              </div>
           </div>
        </div>

        <form className="bg-neo-green dark:bg-slate-800 p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white space-y-4" onSubmit={(e) => e.preventDefault()}>
           <div>
              <label className="block text-sm font-bold mb-1 text-black dark:text-white uppercase">Name</label>
              <input type="text" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-900 focus:outline-none focus:shadow-neo-sm transition-all" />
           </div>
           <div>
              <label className="block text-sm font-bold mb-1 text-black dark:text-white uppercase">Email</label>
              <input type="email" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-900 focus:outline-none focus:shadow-neo-sm transition-all" />
           </div>
           <div>
              <label className="block text-sm font-bold mb-1 text-black dark:text-white uppercase">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-slate-900 focus:outline-none focus:shadow-neo-sm transition-all"></textarea>
           </div>
           <button className="w-full py-3 bg-black text-white hover:bg-white hover:text-black border-2 border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold uppercase transition-all">Send Message</button>
        </form>
      </div>
   </div>
);

// --- Layout Wrapper ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       return document.documentElement.classList.contains('dark') || 
              localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col font-body bg-white dark:bg-slate-900">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        {children}
      </main>
      <ChatAssistant />
      <Footer />
    </div>
  );
};

// --- App Component ---
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/projects" element={<Home />} /> {/* Reuse Home highlights or create separate page */}
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallbacks */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;