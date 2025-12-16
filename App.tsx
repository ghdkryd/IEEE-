import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download, ChevronRight, ChevronLeft, Upload, Play, Copy, RefreshCw, Palette, Image as ImageIcon, Layout as LayoutIcon, Sparkles, FileText, Zap, Monitor, Layers } from 'lucide-react';
import { NAV_ITEMS, MISSION } from './constants';
import { ChatAssistant } from './components/ChatAssistant';
import { generateSlides } from './services/geminiService';
import { Slide, Theme } from './types';

// --- Extended Theme Configurations ---
const THEMES: Record<Theme, { 
  name: string; 
  bg: string; 
  text: string;
  accent: string;
  previewClass: string; // Used for the slide container styling
}> = {
  neo: {
    name: 'Neo-Brutalist',
    bg: 'bg-yellow-50',
    text: 'text-black',
    accent: 'bg-neo-pink',
    previewClass: 'bg-white border-4 border-black font-sans'
  },
  cyber: {
    name: 'Cyberpunk',
    bg: 'bg-zinc-950',
    text: 'text-cyan-400',
    accent: 'bg-purple-600',
    previewClass: 'bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] font-mono text-cyan-400'
  },
  corporate: {
    name: 'Professional',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-blue-700',
    previewClass: 'bg-gradient-to-br from-white to-slate-100 border border-slate-300 shadow-xl font-sans text-slate-800'
  },
  minimal: {
    name: 'Editorial',
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    accent: 'bg-stone-800',
    previewClass: 'bg-white shadow-lg font-serif text-stone-900'
  },
  tech: {
    name: 'Tech Blue',
    bg: 'bg-slate-900',
    text: 'text-white',
    accent: 'bg-blue-500',
    previewClass: 'bg-slate-900 border-t-4 border-blue-500 text-white font-sans'
  },
  lux: {
    name: 'Luxury',
    bg: 'bg-black',
    text: 'text-amber-100',
    accent: 'bg-amber-600',
    previewClass: 'bg-neutral-900 border border-amber-500/30 text-amber-50 font-serif'
  },
  nature: {
    name: 'Organic',
    bg: 'bg-green-50',
    text: 'text-green-900',
    accent: 'bg-green-600',
    previewClass: 'bg-[#F0F5F0] text-green-900 font-sans'
  },
  gradient: {
    name: 'Vibrant',
    bg: 'bg-white',
    text: 'text-white',
    accent: 'bg-white',
    previewClass: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-sans'
  }
};

// --- Improved Image URL Helper ---
const getAIImageUrl = (prompt: string, seed: number) => {
  // Simplified prompt to avoid filters and ensure clarity
  const cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, ""); 
  const enhancedPrompt = encodeURIComponent(`${cleanPrompt}, professional 4k, photorealistic, cinematic composition`);
  // Added a random seed per slide/index to ensure images don't cache aggressively or duplicate
  return `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;
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
        <p className="bg-neo-yellow text-black px-2 mt-4 md:mt-0 border-2 border-black">Powered by Gemini & Pollinations.ai</p>
      </div>
    </div>
  </footer>
);

// --- Vertical Workspace Style Slide Preview ---
const SlideWorkspace: React.FC<{ slides: Slide[]; theme: Theme }> = ({ slides, theme }) => {
  const themeConfig = THEMES[theme];

  const handleDownload = () => {
    alert("Exporting to PPTX... (This is a demo)");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#1e1e1e] relative">
      
      {/* Top Bar */}
      <div className="w-full bg-[#2d2d2d] text-white p-4 flex justify-between items-center border-b border-[#3d3d3d] sticky top-20 z-30 shadow-md">
        <div className="flex items-center gap-3">
           <Monitor size={20} className="text-blue-400" />
           <span className="font-bold text-sm tracking-wide">PRESENTATION PREVIEW</span>
           <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded font-bold">{slides.length} SLIDES</span>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded transition-colors">
          <Download size={14} /> Export PPTX
        </button>
      </div>

      {/* Slide Canvas */}
      <div className="w-full max-w-6xl p-8 space-y-12 pb-32">
        {slides.map((slide, index) => (
          <div key={index} className="flex gap-4 items-start group">
            
            {/* Slide Index & Tools */}
            <div className="w-12 text-right pt-4 text-gray-500 font-mono text-xs hidden md:block">
               {String(index + 1).padStart(2, '0')}
            </div>

            {/* THE SLIDE (16:9 Aspect Ratio Container) */}
            <div className={`relative w-full aspect-video shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.01] ${themeConfig.previewClass}`}>
               
               {/* Background Elements based on theme */}
               {theme === 'tech' && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>}
               {theme === 'nature' && <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>}
               {theme === 'lux' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>}

               {/* Inner Content Area with Padding */}
               <div className="relative z-10 w-full h-full p-12 flex flex-col">
                  
                  {/* --- LAYOUT LOGIC --- */}
                  
                  {slide.layout === 'title' && (
                     <div className="h-full flex flex-col justify-center items-center text-center relative">
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0">
                           <img 
                              src={getAIImageUrl(slide.imagePrompt, index)} 
                              alt="Background" 
                              className={`w-full h-full object-cover ${theme === 'neo' ? 'opacity-10 mix-blend-multiply' : 'opacity-30 mix-blend-overlay'}`} 
                            />
                           {theme !== 'neo' && <div className={`absolute inset-0 ${theme === 'lux' ? 'bg-black/80' : 'bg-slate-900/60'}`}></div>}
                        </div>
                        
                        <div className="relative z-10 max-w-4xl">
                           <span className={`inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border ${theme === 'neo' ? 'border-black text-black' : 'border-current opacity-70'}`}>
                              Presentation Deck
                           </span>
                           <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase leading-tight drop-shadow-lg">
                              {slide.title}
                           </h1>
                           <div className={`w-24 h-1 mx-auto mb-8 ${themeConfig.accent}`}></div>
                           <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
                              {slide.content}
                           </p>
                        </div>
                     </div>
                  )}

                  {slide.layout === 'split' && (
                     <div className="h-full flex gap-8 items-center">
                        <div className="w-1/2 h-full flex flex-col justify-center">
                           <h2 className={`text-4xl font-bold mb-6 uppercase leading-none ${theme === 'gradient' ? 'text-white/90' : ''}`}>{slide.title}</h2>
                           <p className="text-lg mb-8 opacity-80 leading-relaxed">{slide.content}</p>
                           <ul className="space-y-4">
                              {slide.bulletPoints.map((bp, i) => (
                                 <li key={i} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 ${themeConfig.accent} rounded-full`}></div>
                                    <span className="font-semibold opacity-90">{bp}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                        <div className="w-1/2 h-full relative p-4">
                           <div className={`w-full h-full relative overflow-hidden ${theme === 'neo' ? 'border-4 border-black shadow-neo-sm' : 'rounded-lg shadow-xl'}`}>
                              <img src={getAIImageUrl(slide.imagePrompt, index)} className="w-full h-full object-cover" />
                           </div>
                        </div>
                     </div>
                  )}

                  {(slide.layout === 'bullet' || slide.layout === 'image-center') && (
                     <div className="h-full flex flex-col">
                        <div className="flex justify-between items-end mb-8 border-b border-current/20 pb-4">
                           <h2 className="text-4xl font-bold uppercase tracking-tight">{slide.title}</h2>
                           <span className={`text-xs font-bold px-2 py-1 ${themeConfig.accent} ${theme === 'neo' ? 'text-black' : 'text-white'}`}>{index + 1}</span>
                        </div>
                        <div className="flex-grow flex gap-8">
                           <div className="w-2/3 pr-8">
                              <p className="text-xl mb-8 font-medium leading-relaxed opacity-90">{slide.content}</p>
                              <div className="grid grid-cols-1 gap-4">
                                 {slide.bulletPoints.map((bp, i) => (
                                    <div key={i} className={`p-4 flex items-center gap-4 ${theme === 'neo' ? 'bg-white border-2 border-black' : 'bg-white/5 border-l-4 border-current/50'}`}>
                                       <span className="text-2xl font-black opacity-30">{i+1}</span>
                                       <span className="text-lg font-bold">{bp}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="w-1/3 relative">
                               <div className={`absolute inset-0 ${theme === 'neo' ? 'border-4 border-black bg-neo-pink' : 'rounded-lg overflow-hidden'}`}>
                                  <img src={getAIImageUrl(slide.imagePrompt, index)} className="w-full h-full object-cover mix-blend-normal hover:scale-110 transition-transform duration-700" />
                               </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {slide.layout === 'quote' && (
                     <div className="h-full flex flex-col justify-center items-center text-center relative z-10">
                        <div className="text-[120px] leading-none opacity-20 font-serif absolute top-10 left-10">“</div>
                        <h2 className="text-4xl md:text-5xl font-black italic leading-tight mb-10 max-w-4xl relative z-10">
                           {slide.content}
                        </h2>
                        <div className={`h-1 w-20 ${themeConfig.accent} mb-6`}></div>
                        <p className="text-xl font-bold uppercase tracking-widest opacity-60">{slide.title}</p>
                     </div>
                  )}

               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Generator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('tech');
  const [generationMode, setGenerationMode] = useState<'strict' | 'creative'>('creative');
  const [slideCount, setSlideCount] = useState<number>(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setSlides(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const generatedSlides = await generateSlides(inputText, generationMode, slideCount);
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
    <div className="w-full">
      {/* If slides exist, show the previewer full width. If not, show the input grid. */}
      {slides && !isGenerating ? (
        <div className="relative">
           <button 
             onClick={() => setSlides(null)} 
             className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase border-2 border-white shadow-lg hover:bg-neo-pink hover:text-black hover:border-black transition-all"
           >
             <ChevronLeft size={20} /> Back to Editor
           </button>
           <SlideWorkspace slides={slides} theme={selectedTheme} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: SETTINGS */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-6 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
                
                {/* Theme Selector */}
                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                   <Palette size={18} /> Presentation Style
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {Object.entries(THEMES).map(([key, config]) => (
                     <button
                       key={key}
                       onClick={() => setSelectedTheme(key as Theme)}
                       className={`p-2 text-left border-2 transition-all flex flex-col gap-2 ${selectedTheme === key ? 'border-black dark:border-white bg-slate-100 dark:bg-slate-700 ring-1 ring-black dark:ring-white' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                     >
                        <div className={`w-full h-6 ${config.bg} border border-slate-300 relative overflow-hidden shadow-sm`}>
                           <div className={`absolute top-0 right-0 w-3 h-full ${config.accent}`}></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase truncate w-full block">{config.name}</span>
                     </button>
                   ))}
                </div>

                {/* Slide Count Slider */}
                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                   <Layers size={18} /> Slide Count: <span className="text-neo-pink dark:text-ieee-blue text-2xl ml-auto">{slideCount}</span>
                </h2>
                <input 
                  type="range" 
                  min="3" 
                  max="20" 
                  value={slideCount} 
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  className="w-full mb-8 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />

                {/* Mode Selector */}
                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                   <Zap size={18} /> AI Creativity
                </h2>
                <div className="flex flex-col gap-2">
                   <button 
                      onClick={() => setGenerationMode('strict')}
                      className={`p-3 border-2 text-left transition-all ${generationMode === 'strict' ? 'border-black bg-neo-yellow text-black' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                   >
                      <div className="font-bold uppercase text-xs flex items-center gap-2">
                        <FileText size={14} /> Strict Summary
                      </div>
                   </button>
                   
                   <button 
                      onClick={() => setGenerationMode('creative')}
                      className={`p-3 border-2 text-left transition-all ${generationMode === 'creative' ? 'border-black bg-neo-purple text-black' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                   >
                      <div className="font-bold uppercase text-xs flex items-center gap-2">
                        <Sparkles size={14} /> Creative Expansion
                      </div>
                   </button>
                </div>

              </div>
            </div>

            {/* RIGHT: CONTENT INPUT */}
            <div className="lg:col-span-8">
               <div className="bg-white dark:bg-slate-800 p-8 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white min-h-[600px] flex flex-col relative overflow-hidden">
                  
                  {isGenerating ? (
                    <div className="absolute inset-0 z-20 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center p-8">
                       <div className="relative w-32 h-32 mb-8">
                          <div className="absolute inset-0 bg-neo-yellow rounded-full animate-ping opacity-20"></div>
                          <div className="relative w-full h-full border-8 border-black border-t-neo-pink rounded-full animate-spin"></div>
                       </div>
                       <h3 className="text-4xl font-black uppercase animate-pulse mb-4">Forging Deck</h3>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                          Thinking: {generationMode} Mode <br/>
                          Generating {slideCount} Slides <br/>
                          Designing "{THEMES[selectedTheme].name}" Style
                       </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-2">
                         <LayoutIcon size={28} /> Content Source
                      </h2>
                      <p className="text-slate-500 mb-4">Paste your topic, notes, or full report below. We will structure it into a {slideCount}-slide presentation.</p>
                      
                      <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="e.g. A pitch deck for a new AI startup focused on sustainable energy. Include market size, problem, solution, and business model..."
                        className="w-full flex-grow min-h-[300px] p-6 border-2 border-black bg-slate-50 focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 font-medium text-lg resize-none mb-6 transition-all"
                      />
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                         <div className="flex-1">
                            <label className="flex items-center justify-center w-full h-full p-4 bg-slate-100 border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-200 transition-all text-sm font-bold uppercase text-slate-500 gap-2">
                               <Upload size={18} /> Upload .TXT
                               <input type="file" onChange={handleFileUpload} className="hidden" />
                            </label>
                         </div>
                         <button 
                           onClick={handleGenerate}
                           disabled={!inputText}
                           className="flex-[2] py-4 bg-black text-white text-xl font-black uppercase tracking-widest border-4 border-transparent hover:bg-neo-green hover:text-black hover:border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                         >
                           Generate Deck <ChevronRight size={24} />
                         </button>
                      </div>
                    </>
                  )}
               </div>
            </div>

          </div>
        </div>
      )}
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