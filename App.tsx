import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download, ChevronRight, ChevronLeft, Upload, Play, Copy, RefreshCw, Palette, Image as ImageIcon, Layout as LayoutIcon, Sparkles, FileText, Zap } from 'lucide-react';
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
    text: 'text-cyan-400',
    accent: 'bg-purple-600',
    border: 'border-cyan-500',
    font: 'font-mono',
    shadow: 'shadow-[0px_0px_15px_rgba(34,211,238,0.5)]',
    previewClass: 'bg-black border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
  },
  corporate: {
    name: 'Professional',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-blue-700',
    border: 'border-slate-200',
    font: 'font-sans',
    shadow: 'shadow-xl',
    previewClass: 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-2xl'
  },
  minimal: {
    name: 'Editorial',
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    accent: 'bg-stone-800',
    border: 'border-transparent',
    font: 'font-serif',
    shadow: 'shadow-sm',
    previewClass: 'bg-white shadow-lg'
  }
};

// --- Helper for Images ---
const getAIImageUrl = (prompt: string, seed: number) => {
  const encodedPrompt = encodeURIComponent(prompt + " cinematic lighting, highly detailed, 8k, professional photography");
  // Using Pollinations.ai for real-time generation
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

// --- New Vertical Slide Preview Component ---
const SlideListPreview: React.FC<{ slides: Slide[]; theme: Theme }> = ({ slides, theme }) => {
  const themeConfig = THEMES[theme];

  const handleDownload = () => {
    alert("This would trigger a PDF/PPTX download in a production app.");
  };

  // Dynamic Styles based on theme
  const getSlideStyles = () => {
    switch (theme) {
      case 'cyber': return 'text-cyan-400 font-mono tracking-wide selection:bg-cyan-900';
      case 'corporate': return 'text-slate-800 font-sans tracking-normal selection:bg-blue-100';
      case 'minimal': return 'text-stone-900 font-serif tracking-tight selection:bg-stone-200';
      default: return 'text-black font-sans tracking-tight selection:bg-neo-pink';
    }
  };

  const getAccentColor = () => {
     switch (theme) {
       case 'cyber': return 'text-purple-400 border-purple-500 bg-purple-900/20';
       case 'corporate': return 'text-blue-700 border-blue-700 bg-blue-50';
       case 'minimal': return 'text-stone-500 border-stone-300 bg-stone-100';
       default: return 'text-neo-pink border-black bg-neo-yellow';
     }
  };

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col items-center gap-12 transition-colors duration-500 ${theme === 'cyber' ? 'bg-zinc-950' : 'bg-slate-100'}`}>
      
      {/* Header Actions */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-white dark:bg-slate-800 p-4 border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm sticky top-24 z-30 mb-4">
        <div className="font-bold text-lg uppercase flex items-center gap-2">
           <FileText size={20} /> Generated Deck ({slides.length} Slides)
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2 bg-black text-white font-bold uppercase hover:bg-neo-pink hover:text-black transition-colors">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Vertical Slide List */}
      <div className="w-full max-w-5xl space-y-16 pb-20">
        {slides.map((slide, index) => (
          <div key={index} className="flex flex-col gap-4">
             {/* Slide Number Label */}
             <div className={`self-start px-3 py-1 text-xs font-bold uppercase tracking-widest border border-current opacity-70 ${theme === 'cyber' ? 'text-cyan-500' : 'text-black'}`}>
                Slide {index + 1}
             </div>

             {/* The Slide Card */}
             <div className={`relative w-full aspect-video overflow-hidden transition-all duration-300 group ${themeConfig.previewClass} ${getSlideStyles()}`}>
                
                {/* --- THEME DECORATIONS --- */}
                {theme === 'neo' && (
                  <>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neo-yellow border-l-4 border-b-4 border-black z-0"></div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-black z-0"></div>
                  </>
                )}
                {theme === 'cyber' && (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                )}
                {theme === 'corporate' && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-700"></div>
                )}

                {/* --- CONTENT CONTAINER --- */}
                <div className="relative z-10 w-full h-full p-8 md:p-16 flex flex-col justify-center">
                  
                  {/* LAYOUT: TITLE SLIDE */}
                  {slide.layout === 'title' && (
                    <div className="flex flex-col items-center justify-center text-center h-full relative">
                        <div className="absolute inset-0 opacity-10 mix-blend-multiply dark:mix-blend-overlay">
                           <img src={getAIImageUrl(slide.imagePrompt || slide.title, index)} className="w-full h-full object-cover" />
                        </div>
                        <h1 className={`text-5xl md:text-7xl font-black mb-6 uppercase leading-none z-10 ${theme === 'cyber' ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}`}>
                          {slide.title}
                        </h1>
                        <div className={`h-1 w-24 mb-6 ${theme === 'cyber' ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : theme === 'neo' ? 'bg-black' : 'bg-current'}`}></div>
                        <p className="text-xl md:text-2xl font-bold opacity-80 max-w-3xl">{slide.content}</p>
                    </div>
                  )}

                  {/* LAYOUT: SPLIT */}
                  {slide.layout === 'split' && (
                    <div className="flex flex-col md:flex-row h-full gap-8 items-center">
                       <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                          <img 
                            src={getAIImageUrl(slide.imagePrompt || slide.title, index)} 
                            className={`w-full h-full object-cover ${theme === 'neo' ? 'border-4 border-black shadow-neo-sm' : theme === 'cyber' ? 'border border-cyan-500 opacity-80' : 'rounded-lg shadow-md'}`} 
                          />
                       </div>
                       <div className="w-full md:w-1/2">
                          <h2 className={`text-4xl font-black mb-6 uppercase leading-tight ${theme === 'neo' ? 'bg-neo-pink inline-block px-2 transform -rotate-1' : 'text-current'}`}>
                            {slide.title}
                          </h2>
                          <p className="text-lg font-medium mb-6 opacity-90 leading-relaxed">{slide.content}</p>
                          <ul className="space-y-3">
                             {slide.bulletPoints.map((bp, i) => (
                               <li key={i} className="flex items-start gap-3">
                                  <div className={`mt-1.5 w-2 h-2 flex-shrink-0 ${theme === 'cyber' ? 'bg-purple-500 shadow-[0_0_5px_#a855f7]' : 'bg-current'}`}></div>
                                  <span className="font-bold opacity-80">{bp}</span>
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                  )}

                  {/* LAYOUT: BULLET / DEFAULT */}
                  {(slide.layout === 'bullet' || slide.layout === 'image-center') && (
                     <div className="h-full flex flex-col">
                        <div className="flex justify-between items-end border-b-2 border-current/20 pb-6 mb-8">
                           <h2 className="text-4xl md:text-5xl font-black uppercase max-w-3xl leading-none">{slide.title}</h2>
                           <span className="text-sm font-bold opacity-50 hidden md:block">{themeConfig.name} Design</span>
                        </div>
                        <div className="flex-grow grid md:grid-cols-2 gap-8 items-center">
                           <div>
                              <p className="text-xl font-medium mb-8 opacity-90 leading-relaxed">{slide.content}</p>
                              <div className="space-y-4">
                                {slide.bulletPoints.map((bp, i) => (
                                  <div key={i} className={`p-4 ${theme === 'neo' ? 'bg-white border-2 border-black shadow-neo-sm' : theme === 'cyber' ? 'bg-zinc-900 border border-zinc-700' : 'bg-slate-50 border-l-4 border-slate-300'}`}>
                                     <p className="font-bold">{bp}</p>
                                  </div>
                                ))}
                              </div>
                           </div>
                           <div className="h-64 md:h-full relative overflow-hidden">
                              <img 
                                src={getAIImageUrl(slide.imagePrompt || slide.title, index)} 
                                className={`w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ${theme === 'neo' ? 'border-4 border-black' : theme === 'corporate' ? 'rounded-lg' : ''}`}
                              />
                           </div>
                        </div>
                     </div>
                  )}

                   {/* LAYOUT: QUOTE */}
                   {slide.layout === 'quote' && (
                     <div className="h-full flex flex-col justify-center items-center relative text-center">
                        <div className="absolute inset-0 z-0 opacity-10">
                           <img src={getAIImageUrl("abstract texture " + theme, index)} className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 max-w-4xl">
                           <div className="mb-8 text-6xl opacity-20">"</div>
                           <h2 className={`text-4xl md:text-6xl font-black italic leading-tight mb-8 ${theme === 'cyber' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500' : ''}`}>
                             {slide.content}
                           </h2>
                           <div className={`h-1 w-32 mx-auto mb-4 ${theme === 'neo' ? 'bg-black' : 'bg-current opacity-30'}`}></div>
                           <p className="text-xl font-bold uppercase tracking-widest opacity-60">{slide.title}</p>
                        </div>
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
  const [selectedTheme, setSelectedTheme] = useState<Theme>('neo');
  const [generationMode, setGenerationMode] = useState<'strict' | 'creative'>('strict');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setSlides(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const generatedSlides = await generateSlides(inputText, generationMode);
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
           <SlideListPreview slides={slides} theme={selectedTheme} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: SETTINGS */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
                
                {/* Theme Selector */}
                <h2 className="text-xl font-black mb-4 uppercase flex items-center gap-2">
                   <Palette size={20} /> Visual Style
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {Object.entries(THEMES).map(([key, config]) => (
                     <button
                       key={key}
                       onClick={() => setSelectedTheme(key as Theme)}
                       className={`p-3 text-left border-2 transition-all flex flex-col gap-2 ${selectedTheme === key ? 'border-black dark:border-white bg-slate-100 dark:bg-slate-700 ring-1 ring-black dark:ring-white' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                     >
                        <div className={`w-full h-8 ${config.bg} border border-slate-300 relative overflow-hidden shadow-sm`}>
                           <div className={`absolute top-0 right-0 w-4 h-full ${config.accent}`}></div>
                        </div>
                        <span className="text-xs font-bold uppercase">{config.name}</span>
                     </button>
                   ))}
                </div>

                {/* Mode Selector */}
                <h2 className="text-xl font-black mb-4 uppercase flex items-center gap-2">
                   <Zap size={20} /> AI Mode
                </h2>
                <div className="flex flex-col gap-2 mb-8">
                   <button 
                      onClick={() => setGenerationMode('strict')}
                      className={`p-4 border-2 text-left transition-all ${generationMode === 'strict' ? 'border-black bg-neo-yellow text-black' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                   >
                      <div className="font-bold uppercase text-sm flex items-center gap-2">
                        <FileText size={16} /> Strict Summary
                      </div>
                      <p className="text-xs mt-1 opacity-80">Stick to facts provided. No hallucinations.</p>
                   </button>
                   
                   <button 
                      onClick={() => setGenerationMode('creative')}
                      className={`p-4 border-2 text-left transition-all ${generationMode === 'creative' ? 'border-black bg-neo-purple text-black' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                   >
                      <div className="font-bold uppercase text-sm flex items-center gap-2">
                        <Sparkles size={16} /> Creative Expansion
                      </div>
                      <p className="text-xs mt-1 opacity-80">Infer details, add examples, and enhance content.</p>
                   </button>
                </div>

              </div>
            </div>

            {/* RIGHT: CONTENT INPUT */}
            <div className="lg:col-span-8">
               <div className="bg-white dark:bg-slate-800 p-8 border-4 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white min-h-[600px] flex flex-col">
                  {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                       <div className="relative w-24 h-24 mb-8">
                          <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                          <div className="absolute inset-4 border-4 border-neo-pink border-b-transparent rounded-full animate-spin reverse"></div>
                       </div>
                       <h3 className="text-4xl font-black uppercase animate-pulse mb-2">Generating Deck</h3>
                       <p className="text-slate-500 font-bold uppercase tracking-widest">{generationMode} Mode Active</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-2">
                         <LayoutIcon size={28} /> Source Content
                      </h2>
                      <p className="text-slate-500 mb-4">Paste your rough notes, report, or article below. NeoDeck will structure it into a compelling narrative.</p>
                      
                      <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="e.g. The IEEE Student Branch is organizing a Hackathon next month. We need sponsors and participants..."
                        className="w-full flex-grow min-h-[300px] p-6 border-2 border-black bg-slate-50 focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 font-medium text-lg resize-none mb-6 transition-all"
                      />
                      
                      <div className="flex gap-4">
                         <div className="flex-1">
                            <label className="flex items-center justify-center w-full h-full p-4 bg-slate-100 border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-200 transition-all text-sm font-bold uppercase text-slate-500 gap-2">
                               <Upload size={18} /> Upload .TXT File
                               <input type="file" onChange={handleFileUpload} className="hidden" />
                            </label>
                         </div>
                         <button 
                           onClick={handleGenerate}
                           disabled={!inputText}
                           className="flex-[2] py-4 bg-black text-white text-xl font-black uppercase tracking-widest border-4 border-transparent hover:bg-neo-green hover:text-black hover:border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                         >
                           Generate Slides <ChevronRight size={24} />
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