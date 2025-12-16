import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download, ChevronRight, ChevronLeft, Upload, Play, Copy, RefreshCw, Palette, Image as ImageIcon, Layout as LayoutIcon } from 'lucide-react';
import { NAV_ITEMS, MISSION } from './constants';
import { ChatAssistant } from './components/ChatAssistant';
import { generateSlides } from './services/geminiService';
import { Slide, Theme } from './types';

// --- Theme Configurations ---
const THEMES: Record<Theme, { 
  name: string; 
  bg: string; 
  text: string; 
  accent: string; 
  border: string; 
  font: string;
  shadow: string;
  previewClass: string;
}> = {
  neo: {
    name: 'Neo-Brutalist',
    bg: 'bg-yellow-50',
    text: 'text-black',
    accent: 'bg-neo-pink',
    border: 'border-black',
    font: 'font-sans',
    shadow: 'shadow-neo',
    previewClass: 'bg-white border-4 border-black'
  },
  cyber: {
    name: 'Cyberpunk',
    bg: 'bg-zinc-950',
    text: 'text-green-400',
    accent: 'bg-purple-600',
    border: 'border-green-500',
    font: 'font-mono',
    shadow: 'shadow-[4px_4px_0_0_#a855f7]',
    previewClass: 'bg-black border-2 border-green-500'
  },
  corporate: {
    name: 'Professional',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-blue-600',
    border: 'border-slate-300',
    font: 'font-sans',
    shadow: 'shadow-lg',
    previewClass: 'bg-white border border-slate-200'
  },
  minimal: {
    name: 'Minimalist',
    bg: 'bg-white',
    text: 'text-zinc-800',
    accent: 'bg-zinc-900',
    border: 'border-transparent',
    font: 'font-serif',
    shadow: 'shadow-sm',
    previewClass: 'bg-zinc-50'
  }
};

// --- Helper for Images ---
const getAIImageUrl = (prompt: string, seed: number) => {
  const encodedPrompt = encodeURIComponent(prompt + " high quality, stylistic, 4k");
  // Using Pollinations.ai for real-time generation without auth
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;
};

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
            <div className="w-10 h-10 bg-neo-pink border-2 border-black dark:border-white flex items-center justify-center shadow-neo-sm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <span className="text-black font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-black dark:text-white hidden sm:block uppercase font-sans">NEO<span className="text-neo-pink">DECK</span></span>
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

      {isMenuOpen && (
        <div className="md:hidden bg-neo-yellow dark:bg-slate-800 border-b-4 border-black dark:border-white">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-lg font-bold border-2 border-black dark:border-white shadow-neo-sm ${
                  location.pathname === item.path
                    ? 'bg-black text-white'
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
  <footer className="bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white pt-12 pb-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} NeoDeck AI.</p>
        <p className="bg-neo-yellow text-black px-2 mt-4 md:mt-0 border-2 border-black">Powered by Groq & Pollinations.ai</p>
      </div>
    </div>
  </footer>
);

// --- Generator Component ---
const SlidePreview: React.FC<{ slides: Slide[]; theme: Theme }> = ({ slides, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const themeConfig = THEMES[theme];

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);

  const currentSlide = slides[currentIndex];

  const handleDownload = () => {
    alert("Downloading feature would generate a PPTX file here.");
  };

  if (!currentSlide) return null;

  // Dynamic Styles based on theme
  const getSlideStyles = () => {
    switch (theme) {
      case 'cyber':
        return 'bg-black text-green-400 font-mono';
      case 'corporate':
        return 'bg-white text-slate-800 font-sans';
      case 'minimal':
        return 'bg-zinc-50 text-zinc-900 font-serif';
      default: // neo
        return 'bg-white text-black font-sans';
    }
  };

  const getAccentColor = () => {
     switch (theme) {
       case 'cyber': return 'text-purple-400 border-purple-500';
       case 'corporate': return 'text-blue-600 border-blue-600';
       case 'minimal': return 'text-black border-black';
       default: return 'text-neo-pink border-black';
     }
  };

  return (
    <div className={`p-4 md:p-8 h-full flex flex-col transition-colors duration-500 ${theme === 'neo' ? 'bg-slate-100 border-4 border-black shadow-neo-lg' : theme === 'cyber' ? 'bg-zinc-900 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-gray-100 shadow-xl'}`}>
      
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-4">
        <div className={`font-bold text-sm uppercase ${theme === 'cyber' ? 'text-green-600' : 'text-slate-500'}`}>
          Slide {currentIndex + 1} / {slides.length}
        </div>
        <button onClick={handleDownload} className={`flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase transition-all ${theme === 'neo' ? 'bg-neo-green text-black border-2 border-black shadow-neo-sm hover:shadow-none' : 'bg-blue-600 text-white rounded hover:bg-blue-700'}`}>
          <Download size={14} /> Export
        </button>
      </div>

      {/* Slide Viewport (16:9 Aspect Ratio) */}
      <div className={`flex-grow aspect-video relative overflow-hidden flex flex-col transition-all duration-300 ${themeConfig.previewClass} ${getSlideStyles()}`}>
        
        {/* Theme Specific Background Decorations */}
        {theme === 'neo' && <div className="absolute top-0 left-0 w-full h-4 bg-neo-pink border-b-4 border-black z-10"></div>}
        {theme === 'cyber' && <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:40px_40px] [background-position:center] opacity-20 pointer-events-none"></div>}
        {theme === 'corporate' && <div className="absolute bottom-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 opacity-50"></div>}

        {/* Content Container */}
        <div className="relative z-20 h-full flex p-8 md:p-16">
          
          {/* --- LAYOUTS --- */}
          
          {currentSlide.layout === 'title' ? (
            <div className="w-full flex flex-col justify-center items-center text-center relative">
               {/* Background Image for Title */}
               <div className="absolute inset-0 z-0 opacity-20">
                  <img 
                    src={getAIImageUrl(currentSlide.imagePrompt || currentSlide.title, currentIndex)} 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale mix-blend-multiply"
                  />
               </div>
               <div className="relative z-10">
                 <h1 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none ${getAccentColor().split(' ')[0]}`}>{currentSlide.title}</h1>
                 <p className="text-xl md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">{currentSlide.content}</p>
               </div>
            </div>

          ) : currentSlide.layout === 'split' ? (
            <div className="flex w-full h-full gap-8 items-center">
              <div className="w-1/2 h-full relative">
                 <div className={`absolute inset-0 ${theme === 'neo' ? 'border-4 border-black shadow-neo-sm' : 'rounded-lg overflow-hidden shadow-lg'}`}>
                    <img 
                      src={getAIImageUrl(currentSlide.imagePrompt || currentSlide.title, currentIndex)} 
                      alt="Slide Visual" 
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                <h2 className={`text-3xl font-black mb-6 uppercase ${theme === 'neo' ? 'bg-neo-yellow inline-block px-2' : ''}`}>{currentSlide.title}</h2>
                <p className="text-lg font-medium mb-6 opacity-90">{currentSlide.content}</p>
                <ul className="space-y-3">
                  {currentSlide.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 flex-shrink-0 ${theme === 'cyber' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-current'}`}></div>
                      <span className="font-bold opacity-80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          ) : currentSlide.layout === 'quote' ? (
             <div className="flex w-full h-full items-center justify-center relative">
                <div className="absolute right-0 top-0 w-64 h-64 opacity-20">
                   <img 
                      src={getAIImageUrl(currentSlide.imagePrompt || "abstract", currentIndex)} 
                      className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="z-10 max-w-4xl text-center">
                  <h2 className="text-xl font-bold opacity-50 mb-8 uppercase tracking-widest">{currentSlide.title}</h2>
                  <blockquote className={`text-4xl md:text-5xl font-black italic leading-tight ${theme === 'neo' ? 'border-l-8 border-black pl-8' : ''}`}>
                    "{currentSlide.content}"
                  </blockquote>
                </div>
             </div>

          ) : (
            // Bullet Layout
            <div className="w-full flex flex-col h-full">
              <div className={`flex items-end justify-between border-b-4 pb-4 mb-8 ${getAccentColor().split(' ')[1]}`}>
                <h2 className="text-4xl font-black uppercase max-w-2xl">{currentSlide.title}</h2>
                <div className="w-24 h-24 hidden md:block opacity-80">
                   <img 
                      src={getAIImageUrl(currentSlide.imagePrompt || "icon", currentIndex)} 
                      className="w-full h-full object-cover rounded-md"
                   />
                </div>
              </div>
              <p className="text-xl font-medium mb-8 opacity-90">{currentSlide.content}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSlide.bulletPoints.map((point, i) => (
                  <div key={i} className={`p-4 ${theme === 'neo' ? 'border-2 border-black shadow-neo-sm bg-white' : theme === 'cyber' ? 'border border-green-900 bg-black/50' : 'bg-slate-50 rounded shadow-sm'}`}>
                    <span className="font-bold opacity-85">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
         <button onClick={prevSlide} className={`p-2 rounded-full transition-all ${theme === 'cyber' ? 'hover:bg-green-900 text-green-500' : 'hover:bg-slate-200'}`} disabled={currentIndex === 0}>
           <ChevronLeft size={28} />
         </button>
         <div className="flex gap-2">
           {slides.map((_, idx) => (
             <button 
               key={idx} 
               onClick={() => setCurrentIndex(idx)}
               className={`w-2 h-2 transition-all rounded-full ${idx === currentIndex ? (theme === 'cyber' ? 'bg-green-500 w-4' : 'bg-black w-4') : 'bg-slate-300'}`}
             />
           ))}
         </div>
         <button onClick={nextSlide} className={`p-2 rounded-full transition-all ${theme === 'cyber' ? 'hover:bg-green-900 text-green-500' : 'hover:bg-slate-200'}`} disabled={currentIndex === slides.length - 1}>
           <ChevronRight size={28} />
         </button>
      </div>
    </div>
  );
};

const Generator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('neo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setSlides(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const generatedSlides = await generateSlides(inputText);
      setSlides(generatedSlides);
    } catch (e) {
      alert("Failed to generate slides. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === 'string') {
             setInputText(text);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Input Section (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
            <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-2">
               <Palette size={24} /> Style
            </h2>
            
            {/* Theme Selector */}
            <div className="grid grid-cols-2 gap-3 mb-8">
               {Object.entries(THEMES).map(([key, config]) => (
                 <button
                   key={key}
                   onClick={() => setSelectedTheme(key as Theme)}
                   className={`p-3 text-left border-2 transition-all flex flex-col gap-2 ${selectedTheme === key ? 'border-black dark:border-white ring-2 ring-offset-2 ring-black dark:ring-white bg-slate-100 dark:bg-slate-700' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                 >
                    <div className={`w-full h-8 ${config.bg} border border-slate-300 relative overflow-hidden`}>
                       <div className={`absolute top-0 right-0 w-4 h-full ${config.accent}`}></div>
                    </div>
                    <span className="text-xs font-bold uppercase">{config.name}</span>
                 </button>
               ))}
            </div>

            <h2 className="text-3xl font-black mb-4 uppercase flex items-center gap-2">
               <LayoutIcon size={24} /> Content
            </h2>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste content about your team, event, or topic here..."
              className="w-full h-48 p-4 border-2 border-black bg-slate-50 focus:outline-none focus:ring-2 focus:ring-neo-pink font-medium text-sm resize-none mb-4"
            />
            
            <div className="flex gap-2 mb-6">
               <button onClick={() => setInputText('')} className="flex-1 p-2 bg-slate-200 text-xs font-bold uppercase border border-black hover:bg-slate-300">Clear</button>
               <button className="flex-1 p-2 bg-slate-200 text-xs font-bold uppercase border border-black hover:bg-slate-300 relative overflow-hidden">
                  Upload .TXT
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </button>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !inputText}
              className="w-full py-4 bg-black text-white text-xl font-black uppercase tracking-widest border-4 border-transparent hover:bg-neo-pink hover:text-black hover:border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? <RefreshCw className="animate-spin" /> : "Generate Deck"}
            </button>
          </div>
        </div>

        {/* Output Section (8 Columns) */}
        <div className="lg:col-span-8 min-h-[600px]">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-neo border-dashed">
               <div className="w-32 h-32 relative mb-8">
                  <div className="absolute inset-0 bg-neo-pink animate-ping opacity-75 rounded-full"></div>
                  <div className="relative bg-white border-4 border-black w-32 h-32 flex items-center justify-center rounded-full z-10">
                     <RefreshCw size={48} className="animate-spin" />
                  </div>
               </div>
               <h3 className="text-3xl font-black uppercase animate-pulse">Forging Slides...</h3>
               <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest">Designing & Generating AI Images</p>
            </div>
          ) : slides ? (
            <SlidePreview slides={slides} theme={selectedTheme} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 border-4 border-black dark:border-white border-dashed opacity-50 p-8 text-center">
               <ImageIcon size={64} className="mb-6 text-slate-400" />
               <h3 className="text-2xl font-bold uppercase text-slate-500 mb-2">Ready to Design</h3>
               <p className="text-slate-400 max-w-md mx-auto">Select a theme on the left, paste your content, and watch AI generate slides with custom imagery.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const About: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold text-black dark:text-white mb-6 uppercase tracking-tighter">How It Works</h1>
      <div className="w-full h-1 bg-black dark:bg-white mb-8"></div>
      <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        {MISSION}
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { step: '01', title: 'Input', desc: 'Paste your text or upload a file containing your raw content.' },
        { step: '02', title: 'Process', desc: 'Our AI engine analyzes structure, key points, and tone.' },
        { step: '03', title: 'Design', desc: 'Content is mapped to bold, neo-brutalist layouts automatically.' }
      ].map((item) => (
        <div key={item.step} className="bg-white dark:bg-slate-900 p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white relative">
          <div className="absolute -top-6 -left-2 bg-neo-pink text-black px-4 py-1 font-bold border-2 border-black">{item.step}</div>
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4 mt-2 uppercase">{item.title}</h2>
          <p className="text-slate-700 dark:text-slate-300 font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Contact: React.FC = () => (
   <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 p-8 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8 uppercase text-center">Contact Support</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
           <div>
              <label className="block text-sm font-bold mb-1 text-black dark:text-white uppercase">Email</label>
              <input type="email" className="w-full px-4 py-3 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 focus:outline-none focus:shadow-neo-sm transition-all" />
           </div>
           <div>
              <label className="block text-sm font-bold mb-1 text-black dark:text-white uppercase">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 focus:outline-none focus:shadow-neo-sm transition-all"></textarea>
           </div>
           <button className="w-full py-4 bg-neo-blue text-white border-2 border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold uppercase transition-all">Send Inquiry</button>
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
    <div className="min-h-screen flex flex-col font-body bg-yellow-50 dark:bg-slate-950 transition-colors duration-300">
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
          <Route path="/" element={<Generator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Generator />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;