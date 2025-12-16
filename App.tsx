import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, FileText, ChevronRight, ChevronLeft, Upload, Play, Download, Copy, RefreshCw } from 'lucide-react';
import { ORG_NAME, NAV_ITEMS, MISSION } from './constants';
import { ChatAssistant } from './components/ChatAssistant';
import { generateSlides } from './services/geminiService';
import { Slide } from './types';

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
        <p className="bg-neo-yellow text-black px-2 mt-4 md:mt-0 border-2 border-black">Powered by Gemini 2.5 Flash</p>
      </div>
    </div>
  </footer>
);

// --- Generator Component ---
const SlidePreview: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);

  const currentSlide = slides[currentIndex];

  const handleDownload = () => {
    alert("In a real app, this would download a .pptx file generated from the JSON!");
  };

  if (!currentSlide) return null;

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 md:p-8 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400">
          Slide {currentIndex + 1} of {slides.length}
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1 bg-neo-green text-black border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] text-xs font-bold uppercase transition-all">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Slide Viewport */}
      <div className="flex-grow bg-white aspect-video border-2 border-black relative overflow-hidden flex flex-col p-8 md:p-12 mb-6">
        {/* Decorative elements based on layout */}
        <div className="absolute top-0 left-0 w-full h-2 bg-neo-pink"></div>
        {currentSlide.layout === 'title' && (
           <div className="absolute bottom-0 right-0 w-24 h-24 bg-neo-yellow rounded-tl-full opacity-50"></div>
        )}

        <div className="z-10 h-full flex flex-col">
          {currentSlide.layout === 'title' ? (
            <div className="my-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase tracking-tighter leading-none">{currentSlide.title}</h1>
              <p className="text-xl md:text-2xl font-bold text-slate-600 max-w-2xl mx-auto">{currentSlide.content}</p>
            </div>
          ) : currentSlide.layout === 'split' ? (
            <div className="flex h-full gap-8">
              <div className="w-1/2 flex flex-col justify-center border-r-4 border-black pr-8">
                <h2 className="text-3xl font-black text-black mb-4 uppercase">{currentSlide.title}</h2>
                <p className="text-lg font-medium text-slate-700">{currentSlide.content}</p>
              </div>
              <div className="w-1/2 flex flex-col justify-center pl-4">
                 <ul className="space-y-4">
                  {currentSlide.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 bg-neo-blue border-2 border-black mt-1 flex-shrink-0"></div>
                      <span className="font-bold text-slate-800">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : currentSlide.layout === 'quote' ? (
             <div className="my-auto">
                <h2 className="text-2xl font-black text-slate-400 mb-8 uppercase text-center">{currentSlide.title}</h2>
                <blockquote className="text-3xl md:text-4xl font-bold text-black border-l-8 border-neo-pink pl-6 py-2 italic leading-tight">
                  "{currentSlide.content}"
                </blockquote>
             </div>
          ) : (
            // Default Bullet Layout
            <div className="flex flex-col h-full">
              <div className="border-b-4 border-black pb-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-black uppercase">{currentSlide.title}</h2>
              </div>
              <p className="text-lg font-medium text-slate-700 mb-6">{currentSlide.content}</p>
              <ul className="grid grid-cols-1 gap-4">
                {currentSlide.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 bg-slate-50 border-2 border-black p-3 shadow-neo-sm">
                    <div className="w-3 h-3 bg-black"></div>
                    <span className="font-bold text-slate-800">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
         <button onClick={prevSlide} className="p-3 bg-white text-black border-2 border-black shadow-neo-sm hover:shadow-none transition-all disabled:opacity-50" disabled={currentIndex === 0}>
           <ChevronLeft size={24} />
         </button>
         <div className="flex gap-2">
           {slides.map((_, idx) => (
             <button 
               key={idx} 
               onClick={() => setCurrentIndex(idx)}
               className={`w-3 h-3 border-2 border-black transition-all ${idx === currentIndex ? 'bg-black scale-125' : 'bg-white'}`}
             />
           ))}
         </div>
         <button onClick={nextSlide} className="p-3 bg-white text-black border-2 border-black shadow-neo-sm hover:shadow-none transition-all disabled:opacity-50" disabled={currentIndex === slides.length - 1}>
           <ChevronRight size={24} />
         </button>
      </div>
    </div>
  );
};

const Generator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setSlides(null);
    
    // Smooth scroll to top
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
      } else {
        // Mocking file reading for non-text files for demo purposes
        setInputText(`Presentation about ${file.name.split('.')[0]}.\n\n(Content extracted from ${file.name} would appear here...)`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-8">
          <div className="bg-neo-yellow dark:bg-slate-800 p-8 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
            <h1 className="text-5xl font-bold text-black dark:text-white mb-6 uppercase tracking-tighter leading-none">
              Turn Text into <br/><span className="bg-white px-2">Decks</span> Instantly
            </h1>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-300 mb-8">
              Paste your notes, essay, or upload a text file. AI will format it into a punchy, neo-brutalist presentation.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your content here or describe the presentation you want..."
                  className="w-full h-64 p-4 border-4 border-black bg-white focus:outline-none focus:bg-slate-50 font-mono text-sm resize-none"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                   <button 
                     onClick={() => setInputText('')}
                     className="p-2 bg-slate-200 border-2 border-black hover:bg-red-200 transition-colors" 
                     title="Clear"
                   >
                     <RefreshCw size={16} />
                   </button>
                   <button 
                     onClick={() => navigator.clipboard.readText().then(t => setInputText(t))}
                     className="p-2 bg-slate-200 border-2 border-black hover:bg-green-200 transition-colors"
                     title="Paste"
                   >
                     <Copy size={16} />
                   </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative overflow-hidden inline-block">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black shadow-neo-sm font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full md:w-auto justify-center">
                    <Upload size={20} /> Upload File
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase">.TXT supported natively</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !inputText}
            className="w-full py-6 bg-black text-white text-2xl font-black uppercase tracking-widest border-4 border-transparent hover:bg-neo-pink hover:text-black hover:border-black shadow-neo-lg hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          >
            {isGenerating ? (
              <>Generating <RefreshCw className="animate-spin" /></>
            ) : (
              <>Generate Deck <Play fill="currentColor" /></>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="min-h-[500px]">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-neo border-dashed">
               <div className="w-24 h-24 bg-neo-blue animate-bounce border-4 border-black mb-8"></div>
               <h3 className="text-2xl font-bold uppercase animate-pulse">Forging Slides...</h3>
               <p className="text-slate-500 font-mono mt-2">Connecting ideas...</p>
            </div>
          ) : slides ? (
            <SlidePreview slides={slides} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 border-4 border-black dark:border-white border-dashed opacity-50">
               <FileText size={64} className="mb-4 text-slate-400" />
               <h3 className="text-xl font-bold uppercase text-slate-500">Preview Area</h3>
               <p className="text-slate-400">Your generated slides will appear here</p>
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
        { step: '02', title: 'Process', desc: 'Our Gemini-powered engine analyzes structure, key points, and tone.' },
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
    <div className="min-h-screen flex flex-col font-body bg-yellow-50 dark:bg-slate-950">
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