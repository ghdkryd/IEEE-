import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download, ChevronRight, ChevronLeft, Upload, Play, Copy, RefreshCw, Palette, Layout as LayoutIcon, Sparkles, FileText, Zap, Monitor, Layers, Type as TypeIcon } from 'lucide-react';
import { NAV_ITEMS, MISSION } from './constants';
import { ChatAssistant } from './components/ChatAssistant';
import { generateSlides } from './services/geminiService';
import { Slide, Theme, FontKey } from './types';

// --- Helper: Detect Arabic ---
const isArabic = (text: string) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

// --- Font Configurations ---
const FONTS: Record<FontKey, { name: string; class: string; type: 'arabic' | 'english' | 'both' }> = {
  cairo: { name: 'Cairo (Modern Arabic)', class: 'font-cairo', type: 'both' },
  tajawal: { name: 'Tajawal (Clean Arabic)', class: 'font-tajawal', type: 'both' },
  amiri: { name: 'Amiri (Classic Arabic)', class: 'font-amiri', type: 'both' },
  inter: { name: 'Inter (Standard)', class: 'font-sans', type: 'english' },
  grotesk: { name: 'Space Grotesk (Bold)', class: 'font-grotesk', type: 'english' },
  playfair: { name: 'Playfair (Elegant)', class: 'font-serif', type: 'english' },
  mono: { name: 'Roboto Mono (Code)', class: 'font-mono', type: 'english' },
};

// --- Theme Configurations ---
// Optimized for Text-Only Layouts (using patterns and borders)
const THEMES: Record<Theme, { 
  name: string; 
  bg: string; 
  text: string;
  accent: string;
  previewClass: string;
  pattern?: string;
}> = {
  neo: {
    name: 'Neo-Brutalist',
    bg: 'bg-yellow-50',
    text: 'text-black',
    accent: 'bg-neo-pink',
    previewClass: 'bg-white border-8 border-black',
    pattern: 'bg-[radial-gradient(black_1px,transparent_1px)] [background-size:16px_16px] opacity-20'
  },
  swiss: {
    name: 'Swiss Style',
    bg: 'bg-[#f0f0f0]',
    text: 'text-black',
    accent: 'bg-red-600',
    previewClass: 'bg-[#f0f0f0] border-l-[32px] border-red-600 shadow-xl text-black',
    pattern: 'opacity-5'
  },
  retro: {
    name: 'Retrowave',
    bg: 'bg-[#1a0b2e]',
    text: 'text-pink-400',
    accent: 'bg-cyan-400',
    previewClass: 'bg-[#1a0b2e] border-4 border-pink-500 shadow-[0_0_30px_#ec4899] text-cyan-300',
    pattern: 'bg-[linear-gradient(transparent_95%,rgba(236,72,153,0.3)_95%)] bg-[size:100%_40px]'
  },
  bauhaus: {
    name: 'Bauhaus',
    bg: 'bg-[#f4f4f0]',
    text: 'text-slate-900',
    accent: 'bg-yellow-500',
    previewClass: 'bg-[#f4f4f0] border-b-[20px] border-blue-600 border-r-[20px] border-red-600 shadow-lg',
  },
  cyber: {
    name: 'Cyberpunk',
    bg: 'bg-zinc-950',
    text: 'text-cyan-400',
    accent: 'bg-purple-600',
    previewClass: 'bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-400',
    pattern: 'bg-[linear-gradient(45deg,rgba(6,182,212,0.1)_25%,transparent_25%,transparent_50%,rgba(6,182,212,0.1)_50%,rgba(6,182,212,0.1)_75%,transparent_75%,transparent)] [background-size:20px_20px]'
  },
  corporate: {
    name: 'Professional',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-blue-800',
    previewClass: 'bg-gradient-to-br from-white to-slate-200 border border-slate-300 shadow-xl text-slate-800'
  },
  minimal: {
    name: 'Editorial',
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    accent: 'bg-stone-800',
    previewClass: 'bg-white shadow-lg text-stone-900 border border-stone-100'
  },
  tech: {
    name: 'Tech Blue',
    bg: 'bg-slate-900',
    text: 'text-white',
    accent: 'bg-blue-500',
    previewClass: 'bg-slate-900 border-t-8 border-blue-500 text-white',
    pattern: 'bg-[radial-gradient(rgba(59,130,246,0.2)_1px,transparent_1px)] [background-size:20px_20px]'
  },
  lux: {
    name: 'Luxury',
    bg: 'bg-[#0a0a0a]',
    text: 'text-amber-100',
    accent: 'bg-amber-600',
    previewClass: 'bg-[#0a0a0a] border border-amber-500/50 text-amber-50 shadow-2xl'
  },
  nature: {
    name: 'Organic',
    bg: 'bg-green-50',
    text: 'text-green-900',
    accent: 'bg-green-700',
    previewClass: 'bg-[#F0F5F0] text-green-900 border-4 border-green-900/10'
  },
  gradient: {
    name: 'Vibrant',
    bg: 'bg-white',
    text: 'text-white',
    accent: 'bg-white',
    previewClass: 'bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white'
  },
  geometric: {
    name: 'Geometric',
    bg: 'bg-slate-100',
    text: 'text-slate-900',
    accent: 'bg-indigo-500',
    previewClass: 'bg-slate-50 border-4 border-slate-900 text-slate-900',
    pattern: 'bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]'
  },
  paper: {
    name: 'Sketch / Paper',
    bg: 'bg-orange-50',
    text: 'text-gray-800',
    accent: 'bg-orange-400',
    previewClass: 'bg-[#fffdf5] border-2 border-gray-300 shadow-sm text-gray-800',
    pattern: 'bg-[url("https://www.transparenttextures.com/patterns/cardboard.png")] opacity-40'
  },
  'dark-modern': {
    name: 'Dark Modern',
    bg: 'bg-zinc-900',
    text: 'text-white',
    accent: 'bg-emerald-500',
    previewClass: 'bg-zinc-900 border border-zinc-700 text-white',
    pattern: 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]'
  }
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
        </div>
      </div>
    </nav>
  );
};

// --- Footer Component ---
const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white pt-12 pb-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} NeoDeck AI.</p>
        <p className="bg-neo-yellow text-black px-2 mt-4 md:mt-0 border-2 border-black">Powered by Gemini & Google Cloud</p>
      </div>
    </div>
  </footer>
);

// --- Slide Preview Component ---
const SlideWorkspace: React.FC<{ slides: Slide[]; theme: Theme; font: FontKey }> = ({ slides, theme, font }) => {
  const themeConfig = THEMES[theme];
  const fontConfig = FONTS[font];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownloadHTML = () => {
    if (!containerRef.current) return;
    
    // Create a complete HTML document string
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Presentation Deck</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;700&family=Cairo:wght@400;700&family=Amiri:wght@400;700&family=Tajawal:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
           .font-cairo { font-family: 'Cairo', sans-serif; }
           .font-tajawal { font-family: 'Tajawal', sans-serif; }
           .font-amiri { font-family: 'Amiri', serif; }
           .font-sans { font-family: 'Inter', sans-serif; }
           .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
           .font-serif { font-family: 'Playfair Display', serif; }
           .font-mono { font-family: 'Roboto Mono', monospace; }
           /* Print friendly */
           @media print {
             body { -webkit-print-color-adjust: exact; }
           }
        </style>
      </head>
      <body class="bg-gray-100 p-8 flex flex-col gap-8 items-center">
        ${containerRef.current.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neodeck-${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#18181b] relative">
      
      {/* Top Bar */}
      <div className="w-full bg-[#27272a] text-white p-4 flex justify-between items-center border-b border-[#3f3f46] sticky top-20 z-30 shadow-md">
        <div className="flex items-center gap-3">
           <Monitor size={20} className="text-blue-400" />
           <span className="font-bold text-sm tracking-wide hidden sm:inline">WORKSPACE VIEW</span>
           <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded font-bold">{slides.length} SLIDES</span>
        </div>
        <button onClick={handleDownloadHTML} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded transition-colors">
          <Download size={14} /> Download HTML
        </button>
      </div>

      {/* Slide Canvas */}
      <div ref={containerRef} className="w-full max-w-6xl p-4 md:p-8 space-y-12 pb-32">
        {slides.map((slide, index) => {
          const slideIsArabic = isArabic(slide.title) || isArabic(slide.content);
          
          return (
            <div key={index} className="flex gap-4 items-start group">
              
              {/* Slide Index */}
              <div className="w-8 text-right pt-4 text-gray-500 font-mono text-xs hidden md:block select-none not-printable">
                 {String(index + 1).padStart(2, '0')}
              </div>

              {/* THE SLIDE (16:9 Aspect Ratio Container) */}
              <div 
                className={`relative w-full aspect-video shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.01] ${themeConfig.previewClass}`}
                dir={slideIsArabic ? 'rtl' : 'ltr'}
              >
                 {/* Font Application */}
                 <div className={`w-full h-full absolute inset-0 ${fontConfig.class} pointer-events-none`}></div>

                 {/* Background Pattern */}
                 {themeConfig.pattern && (
                    <div className={`absolute inset-0 pointer-events-none ${themeConfig.pattern}`}></div>
                 )}

                 {/* Inner Content Area */}
                 <div className={`relative z-10 w-full h-full p-12 md:p-16 flex flex-col ${fontConfig.class}`}>
                    
                    {/* --- TITLE LAYOUT --- */}
                    {slide.layout === 'title' && (
                       <div className="h-full flex flex-col justify-center items-center text-center relative">
                          <div className={`w-24 h-2 mb-8 ${themeConfig.accent}`}></div>
                          <h1 className="text-5xl md:text-7xl font-black mb-8 uppercase leading-tight drop-shadow-sm max-w-4xl">
                             {slide.title}
                          </h1>
                          <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
                             {slide.content}
                          </p>
                          <div className="mt-12 opacity-50 text-sm font-bold tracking-[0.2em] uppercase">
                             PRESENTATION
                          </div>
                       </div>
                    )}

                    {/* --- SPLIT LAYOUT --- */}
                    {slide.layout === 'split' && (
                       <div className="h-full flex flex-col md:flex-row gap-12 items-center">
                          <div className="w-full md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-e-4 border-current/10 pb-6 md:pb-0 md:pe-8 h-full">
                             <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{slide.title}</h2>
                             <p className="text-lg opacity-80 leading-relaxed">{slide.content}</p>
                          </div>
                          <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
                             <ul className="space-y-6">
                                {slide.bulletPoints.map((bp, i) => (
                                   <li key={i} className="flex items-start gap-4">
                                      <div className={`mt-1.5 w-6 h-6 flex items-center justify-center ${themeConfig.accent} text-white font-bold text-xs rounded-full shrink-0`}>
                                        {i+1}
                                      </div>
                                      <span className="font-bold text-lg md:text-xl opacity-90">{bp}</span>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    )}

                    {/* --- BULLET LAYOUT --- */}
                    {slide.layout === 'bullet' && (
                       <div className="h-full flex flex-col">
                          <div className="flex justify-between items-end mb-8 border-b-4 border-current/10 pb-4">
                             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{slide.title}</h2>
                             <span className={`text-xl font-black opacity-30`}>0{index + 1}</span>
                          </div>
                          <div className="flex-grow flex gap-12">
                             <div className="w-1/3 hidden md:block opacity-60 text-lg leading-relaxed">
                                {slide.content}
                             </div>
                             <div className="w-full md:w-2/3 space-y-4">
                                {slide.bulletPoints.map((bp, i) => (
                                   <div key={i} className={`p-4 border-l-4 ${i % 2 === 0 ? 'border-current/50 bg-current/5' : 'border-transparent'}`}>
                                      <span className="text-xl font-bold">{bp}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    )}

                    {/* --- FOCUS / CENTER LAYOUT (Replaces Image Center) --- */}
                    {slide.layout === 'focus' && (
                       <div className="h-full flex flex-col justify-center items-center text-center">
                          <div className="mb-4 text-sm font-bold tracking-widest uppercase opacity-50">{slide.title}</div>
                          <div className="flex flex-wrap justify-center gap-6 mb-8">
                             {slide.bulletPoints.map((bp, i) => (
                                <div key={i} className={`px-6 py-4 ${themeConfig.accent} text-white font-bold text-lg shadow-lg transform hover:-translate-y-1 transition-transform`}>
                                   {bp}
                                </div>
                             ))}
                          </div>
                          <p className="text-2xl font-light leading-relaxed max-w-3xl opacity-90 border-t-2 border-current/20 pt-8">
                             {slide.content}
                          </p>
                       </div>
                    )}

                    {/* --- QUOTE LAYOUT --- */}
                    {slide.layout === 'quote' && (
                       <div className="h-full flex flex-col justify-center items-center text-center relative z-10">
                          <div className="text-[120px] leading-none opacity-10 font-serif absolute top-0 left-8">“</div>
                          <h2 className="text-3xl md:text-6xl font-black italic leading-tight mb-12 max-w-5xl relative z-10">
                             {slide.content}
                          </h2>
                          <div className="flex items-center gap-4">
                             <div className={`h-1 w-12 ${themeConfig.accent}`}></div>
                             <p className="text-xl font-bold uppercase tracking-widest opacity-70">{slide.title}</p>
                             <div className={`h-1 w-12 ${themeConfig.accent}`}></div>
                          </div>
                       </div>
                    )}

                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Generator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('tech');
  const [selectedFont, setSelectedFont] = useState<FontKey>('tajawal');
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
           <SlideWorkspace slides={slides} theme={selectedTheme} font={selectedFont} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: SETTINGS */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-6 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-white">
                
                {/* Font Selector */}
                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                   <TypeIcon size={18} /> Typography (الخط)
                </h2>
                <div className="relative mb-4">
                  <select 
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value as FontKey)}
                    className="w-full p-3 bg-slate-100 border-2 border-slate-300 font-bold text-sm focus:border-black appearance-none cursor-pointer"
                  >
                    {Object.entries(FONTS).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none">
                     <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
                {/* Font Preview Box */}
                <div className={`w-full p-4 mb-8 bg-slate-50 border border-slate-200 text-center ${FONTS[selectedFont].class}`}>
                   <p className="text-lg">مثال على الخط</p>
                   <p className="text-sm opacity-70">The quick brown fox jumps.</p>
                </div>

                {/* Theme Selector */}
                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                   <Palette size={18} /> Visual Style
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                   {Object.entries(THEMES).map(([key, config]) => (
                     <button
                       key={key}
                       onClick={() => setSelectedTheme(key as Theme)}
                       className={`p-1.5 text-left border-2 transition-all flex flex-col gap-2 ${selectedTheme === key ? 'border-black dark:border-white ring-2 ring-neo-pink' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                     >
                        <div className={`w-full h-10 ${config.bg} border border-slate-200 relative overflow-hidden shadow-sm flex items-center justify-center`}>
                           <div className={`w-4 h-4 rounded-full ${config.accent}`}></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase truncate w-full block text-center">{config.name}</span>
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
                          Generating {slideCount} Slides <br/>
                          Applying "{THEMES[selectedTheme].name}" Style
                       </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-2">
                         <LayoutIcon size={28} /> Content Source
                      </h2>
                      <p className="text-slate-500 mb-4">Paste your topic, notes, or full report below. Supports Arabic & English.</p>
                      
                      <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="أدخل النص هنا... (e.g. A pitch deck for a new AI startup...)"
                        className="w-full flex-grow min-h-[300px] p-6 border-2 border-black bg-slate-50 focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 font-medium text-lg resize-none mb-6 transition-all"
                        dir={isArabic(inputText) ? 'rtl' : 'ltr'}
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
        { step: '01', title: 'Input', desc: 'Paste your text or upload a file.' },
        { step: '02', title: 'Process', desc: 'AI analyzes content and structure.' },
        { step: '03', title: 'Design', desc: 'Automated typography and layout generation.' }
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