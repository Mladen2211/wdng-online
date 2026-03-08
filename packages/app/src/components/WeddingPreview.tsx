'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Menu, X, Music, Share2, UploadCloud, Heart, ArrowRight, Camera, Star, MapPin, Gift, Cake, Wine, Car, Plane, Home, UtensilsCrossed, Church, Mail, Phone, Instagram } from 'lucide-react';
import { WeddingData } from '@/lib/types';
import { THEMES } from '@/lib/constants';
import GuestUploader from './GuestUploader';
import GuestGallery from './GuestGallery';

// --- PREVIEW RENDERER ---

/* eslint-disable @typescript-eslint/no-explicit-any */
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  clock: Clock,
  music: Music,
  heart: Heart,
  camera: Camera,
  'map-pin': MapPin,
  star: Star,
  gift: Gift,
  cake: Cake,
  wine: Wine,
  car: Car,
  plane: Plane,
  home: Home,
  utensils: UtensilsCrossed,
  church: Church
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface SiteInfo {
  siteId: string;
  ownerClerkId?: string;
}

interface WeddingPreviewProps {
  data: WeddingData;
  siteInfo?: SiteInfo;
  isPreview?: boolean;  // If true, don't show uploader/gallery (just preview mode in builder)
}

const WeddingPreview: React.FC<WeddingPreviewProps> = ({ data, siteInfo, isPreview = false }) => {
  const { config, global, sections } = data;
  
  // Derive initials from names if available, otherwise use stored initials or fallback
  const displayInitials = (global.bride && global.groom) 
    ? `${global.bride.charAt(0)} & ${global.groom.charAt(0)}` 
    : (global.initials || 'W & W');

  const theme = THEMES[config.selectedTheme].colors;
  const layout = config.selectedLayout;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const handleUploadComplete = useCallback(() => {
    setGalleryRefreshKey(prev => prev + 1);
  }, []);

  // Generate navigation labels from sections
  const navLabels = sections.map(section => section.name || section.type.charAt(0).toUpperCase() + section.type.slice(1));

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const container = document.getElementById('preview-container');
    const element = document.getElementById(sectionId);
    if (container && element) {
      const offsetTop = element.offsetTop - 80; // Account for sticky nav height
      container.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  useEffect(() => {
    const container = document.getElementById('preview-container');
    const onScroll = () => container && setScrolled(container.scrollTop > 50);
    container?.addEventListener('scroll', onScroll);

    const target = new Date(config.targetDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;
      if (dist > 0) setTimeLeft({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((dist / 1000 / 60) % 60),
          seconds: Math.floor((dist / 1000) % 60),
      });
    }, 1000);
    return () => { container?.removeEventListener('scroll', onScroll); clearInterval(timer); };
  }, [config.targetDate]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme.bg} ${theme.text}`}>
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shine { background-size: 200% auto; animation: shine 5s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
      `}</style>

      {/* Dynamic Nav */}
      <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? `bg-white/95 backdrop-blur-md border-b ${theme.border} py-3 shadow-sm` : layout === 'immersive' ? 'bg-black/20 backdrop-blur-sm py-6' : `bg-white/90 backdrop-blur-sm border-b ${theme.border} py-6`}`}>
        <div className="px-6 flex justify-between items-center">
          <span className={`font-serif text-xl font-bold tracking-wide ${scrolled ? theme.gradientText : layout === 'immersive' ? 'text-white drop-shadow-lg' : theme.gradientText}`}>{displayInitials}</span>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLabels.map((label, index) => (
              <button
                key={`nav-${index}`}
                onClick={() => scrollToSection(`section-${index}`)}
                className={`font-serif text-sm font-medium tracking-wide transition-colors hover:${theme.accent} ${scrolled ? theme.text : layout === 'immersive' ? 'text-white drop-shadow-lg hover:text-white' : theme.text}`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-3 transition-colors rounded-lg md:hidden ${scrolled ? theme.text : layout === 'immersive' ? 'text-white drop-shadow-lg hover:bg-white/20' : theme.text} hover:bg-stone-100`}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className={`absolute top-full left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b ${theme.border} shadow-xl animate-fade-in-up z-40`}>
            <div className="px-6 py-6 flex flex-col gap-3 max-h-80 overflow-y-auto">
              {navLabels.map((label, index) => (
                <button
                  key={`mobile-nav-${index}`}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`text-left text-lg font-serif py-4 px-4 rounded-lg transition-all duration-200 ${theme.text} hover:bg-stone-50 hover:${theme.accent} active:bg-stone-100 border-l-4 border-transparent hover:border-l-stone-300`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 1. HERO RENDERER (Based on Layout) */}
      <HeroRenderer layout={layout} theme={theme} global={global} timeLeft={timeLeft} />

      {/* 2. DYNAMIC SECTIONS LOOP */}
      <div className="flex flex-col">
        {sections.map((section, index) => (
          <SectionRenderer 
            key={section.id} 
            section={section} 
            theme={theme} 
            layout={layout} 
            sectionIndex={index} 
            isPreview={isPreview}
            siteInfo={siteInfo}
          />
        ))}
      </div>

      {/* 3. FOOTER */}
      <footer className="bg-stone-900 text-white">
        {/* Couple Section */}
        <div className="py-16 text-center border-b border-stone-800">
          <h2 className={`font-serif text-3xl ${theme.gradientText} mb-3`}>{global.bride} & {global.groom}</h2>
          <p className="text-stone-400 text-sm">{global.dateFull} {global.locationCity ? `• ${global.locationCity}` : ''}</p>

          {/* Couple Contact Info */}
          {(global.contactEmail || global.contactPhone || global.contactInstagram) && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {global.contactEmail && (
                <a href={`mailto:${global.contactEmail}`} className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors">
                  <Mail size={14} />
                  {global.contactEmail}
                </a>
              )}
              {global.contactPhone && (
                <a href={`tel:${global.contactPhone}`} className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors">
                  <Phone size={14} />
                  {global.contactPhone}
                </a>
              )}
              {global.contactInstagram && (
                <a
                  href={`https://instagram.com/${global.contactInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors"
                >
                  <Instagram size={14} />
                  {global.contactInstagram.startsWith('@') ? global.contactInstagram : `@${global.contactInstagram}`}
                </a>
              )}
            </div>
          )}

          {global.footerLinks.length > 0 && (
            <div className="flex justify-center gap-6 mt-6 text-xs font-bold uppercase tracking-widest text-stone-500">
              {global.footerLinks.map(l => <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>)}
            </div>
          )}
        </div>

        {/* Platform Attribution */}
        <div className="py-6 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-stone-600 text-[10px] uppercase tracking-widest">{global.copyright}</p>
            <a
              href="https://wdng.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-400 text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <Heart size={10} className="text-rose-500/60" />
              Powered by wdng.online
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- RENDERERS ---

interface HeroRendererProps {
  layout: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeLeft: any;
}

const HeroRenderer: React.FC<HeroRendererProps> = ({ layout, theme, global, timeLeft }) => {
  // Use configurable labels with fallbacks
  const daysLabel = global.daysLabel || 'Days';
  const hoursLabel = global.hoursLabel || 'Hrs';
  const minutesLabel = global.minutesLabel || 'Min';
  const secondsLabel = global.secondsLabel || 'Sec';
  const heroTagline = global.heroTagline || 'The Wedding';
  const imagePosition = global.heroImagePosition || 'object-center';

  if (layout === 'vogue') {
    return (
      <header className="pt-20 pb-12 px-6 bg-[#FAFAF9]">
         <div className="border-b border-stone-300 pb-6 mb-6 flex justify-between items-end">
            <h1 className={`font-serif text-6xl md:text-8xl leading-[0.8] ${theme.text} tracking-tighter`}>{global.bride}</h1>
            <div className="text-right hidden md:block"><p className="text-xs uppercase tracking-widest text-stone-400">{global.locationCity}</p><p className="text-xs uppercase tracking-widest text-stone-400">{global.dateFull}</p></div>
         </div>
         <div className="relative w-full h-[50vh] overflow-hidden mb-6 group">
            {global.heroImage ? (
              <img src={global.heroImage} className={`w-full h-full object-cover ${imagePosition} grayscale group-hover:grayscale-0 transition-all duration-1000`} alt="Hero" />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <span className="text-stone-400">No image selected</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 bg-white px-4 py-2"><p className={`font-serif text-xl ${theme.text} italic`}>{heroTagline}</p></div>
         </div>
         <div className="border-t border-stone-300 pt-6 flex justify-between items-start">
            <div className="flex gap-8">
               <div><span className="block text-[10px] uppercase text-stone-400">{daysLabel}</span><span className={`font-serif text-2xl ${theme.text}`}>{timeLeft.days}</span></div>
               <div><span className="block text-[10px] uppercase text-stone-400">{hoursLabel}</span><span className={`font-serif text-2xl ${theme.text}`}>{timeLeft.hours}</span></div>
            </div>
            <h1 className={`font-serif text-6xl md:text-8xl leading-[0.8] ${theme.text} tracking-tighter text-right`}>{global.groom}</h1>
         </div>
      </header>
    );
  }

  if (layout === 'arch') {
    return (
      <header className="py-20 px-6 flex flex-col items-center bg-white text-center">
         <div className={`inline-block px-3 py-1 rounded-full border ${theme.border} text-[10px] font-bold uppercase tracking-widest mb-6 text-stone-400`}>{global.dateFull} • {global.locationCity}</div>
         <h1 className={`font-serif text-6xl md:text-8xl ${theme.text} mb-8 leading-none`}>{global.bride} <br/><span className={`${theme.accent} italic`}>&</span> {global.groom}</h1>
         <div className="relative w-full max-w-lg mx-auto mb-10">
            <div className="aspect-[3/4] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src={global.heroImage} className={`w-full h-full object-cover ${imagePosition}`} alt="Hero" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-full shadow-lg z-10"><Heart className={theme.accent} fill="currentColor" size={24}/></div>
         </div>
         <div className="flex gap-6 justify-center">
            <CountdownSimple val={timeLeft.days} label={daysLabel} theme={theme} />
            <div className="w-px bg-stone-200 h-8 self-center"></div>
            <CountdownSimple val={timeLeft.hours} label={hoursLabel} theme={theme} />
         </div>
      </header>
    );
  }

  // Default: Immersive
  return (
    <header className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-stone-900">
      <div className="absolute inset-0 z-0">
        <img src={global.heroImage} className={`w-full h-full object-cover ${imagePosition} opacity-60`} alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
      </div>
      <div className="relative z-10 text-center px-4 w-full max-w-4xl animate-fade-in-up">
        <p className="text-white/80 uppercase tracking-[0.3em] mb-4 text-xs font-bold">{global.heroTitle}</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 drop-shadow-lg">
          {global.bride} <span className={`${theme.gradientText} italic font-light px-2`}>&</span> {global.groom}
        </h1>
        <div className="flex justify-center gap-4 text-white/90 mb-12 text-sm md:text-base">
          <span className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/10"><Calendar size={16}/> {global.dateFull} {global.dateTime && `• ${global.dateTime}`}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl">
          <CountdownImmersive val={timeLeft.days} label={daysLabel} />
          <CountdownImmersive val={timeLeft.hours} label={hoursLabel} />
          <CountdownImmersive val={timeLeft.minutes} label={minutesLabel} />
          <CountdownImmersive val={timeLeft.seconds} label={secondsLabel} />
        </div>
      </div>
    </header>
  );
};

interface SectionRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  section: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  layout: string;
  sectionIndex: number;
  isPreview: boolean;
  siteInfo?: SiteInfo;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, theme, layout, sectionIndex, isPreview, siteInfo }) => {
  const { type, data } = section;

  const handleLocationClick = (item: any) => {
    if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`, '_blank');
    } else if (item.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`, '_blank');
    }
  };

  if (type === 'events') {
    return (
      <section id={`section-${sectionIndex}`} className={`py-20 px-6 ${theme.bg}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <Star className={`mx-auto mb-4 ${theme.accent}`} size={20} />
             <h2 className={`font-serif text-4xl md:text-5xl ${theme.text} mb-2`}>{data.title}</h2>
             {data.subtitle && <p className={`${theme.textMuted}`}>{data.subtitle}</p>}
          </div>
          <div className={`${layout === 'vogue' ? 'grid grid-cols-1 border-t border-l border-stone-200' : 'space-y-6'}`}>
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {data.items?.map((item: any, idx: number) => (
                layout === 'vogue' ? (
                  <div key={idx} className="border-r border-b border-stone-200 p-8 hover:bg-stone-50 transition-colors">
                     <span className="text-[10px] uppercase tracking-widest text-stone-400">0{idx+1}</span>
                     <h3 className={`font-serif text-2xl ${theme.text} mt-2 mb-1`}>{item.title}</h3>
                     <button 
                       onClick={() => handleLocationClick(item)}
                       className={`text-sm ${theme.textMuted} mb-4 hover:underline hover:text-stone-800 text-left`}
                       title="Open in Maps"
                     >
                       {item.location}
                     </button>
                     <div className="text-xl font-serif italic">{item.time}</div>
                  </div>
                ) : (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                     <div className={`w-16 h-16 rounded-full ${theme.accentLight} flex items-center justify-center ${theme.accent}`}>
                        {(() => {
                           const IconComponent = ICON_MAP[item.iconType] || Clock;
                           return <IconComponent size={24} />;
                        })()}
                     </div>
                     <div className="flex-1">
                        <h3 className={`font-serif text-2xl ${theme.text}`}>{item.title}</h3>
                        <div className={`text-sm ${theme.textMuted} uppercase tracking-wider mt-1 flex items-center justify-center md:justify-start gap-2`}>
                          <button 
                            onClick={() => handleLocationClick(item)}
                            className="hover:underline hover:text-stone-800 flex items-center gap-1"
                            title="Open in Maps"
                          >
                            {item.location}
                          </button>
                          <span>•</span>
                          <span className={theme.accent}>{item.time}</span>
                        </div>
                        {item.description && <p className="text-stone-400 text-sm mt-2">{item.description}</p>}
                     </div>
                  </div>
                )
             ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === 'photos') {
    const hasAlbum = data.albumId && siteInfo?.ownerClerkId && !isPreview;
    
    // Use custom labels or defaults
    const galleryLabel = data.galleryLabel || 'Gallery';
    const viewAlbumLabel = data.viewAlbumLabel || data.buttonLabel || 'View Album';
    const openInPhotosLabel = data.openInPhotosLabel || 'Open in Google Photos';
    const comingSoonTitle = data.comingSoonTitle || 'Photo Sharing Coming Soon';
    const comingSoonSubtitle = data.comingSoonSubtitle || 'The couple is setting up their photo album.';
    
    return (
      <section id={`section-${sectionIndex}`} className="py-20 px-6 bg-white">
         <div className="max-w-5xl mx-auto">
            {/* Header Card */}
            <div className={`grid md:grid-cols-2 overflow-hidden ${layout === 'arch' ? 'rounded-[3rem] border-4 border-stone-100' : 'rounded-3xl'} shadow-2xl bg-stone-50 mb-12`}>
               <div className="p-12 flex flex-col justify-center">
                  <div className={`inline-flex self-start items-center gap-2 px-3 py-1 ${theme.accentLight} ${theme.accent} rounded-full text-[10px] font-bold uppercase tracking-wide mb-6`}>
                     <Share2 size={12} /> {galleryLabel}
                  </div>
                  <h2 className={`font-serif text-4xl ${theme.text} mb-4`} dangerouslySetInnerHTML={{ __html: data.title }} />
                  <p className={`${theme.textMuted} mb-8`}>{data.subtitle}</p>
                  {data.albumUrl && (
                    <a 
                      href={data.albumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-6 py-3 bg-white border ${theme.border} rounded-xl shadow-sm hover:shadow-md transition-all text-left group`}
                    >
                       <div className={`p-2 rounded-lg ${theme.accentLight} ${theme.accent}`}><UploadCloud size={20}/></div>
                       <div>
                          <div className={`font-bold text-sm ${theme.text}`}>{viewAlbumLabel}</div>
                          <div className="text-[10px] text-stone-400">{openInPhotosLabel}</div>
                       </div>
                       <ArrowRight size={16} className={`ml-2 text-stone-300 group-hover:${theme.accent} transition-colors`}/>
                    </a>
                  )}
               </div>
               <div className="relative h-64 md:h-auto">
                  {data.image ? (
                    <img src={data.image} className="w-full h-full object-cover" alt="Gallery"/>
                  ) : (
                    <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                      <span className="text-stone-400">No image</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Guest Uploader */}
            {hasAlbum && siteInfo && (
              <div className="mb-12">
                <GuestUploader
                  albumId={data.albumId!}
                  ownerClerkId={siteInfo.ownerClerkId!}
                  siteId={siteInfo.siteId}
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            )}

            {/* Gallery Grid */}
            {hasAlbum && siteInfo && (
              <GuestGallery
                albumId={data.albumId!}
                ownerClerkId={siteInfo.ownerClerkId!}
                refreshKey={galleryRefreshKey}
              />
            )}

            {/* Placeholder when no album is set */}
            {!data.albumId && !isPreview && (
              <div className="text-center py-12 bg-stone-50 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                  <Camera size={28} className="text-stone-400" />
                </div>
                <h3 className="font-bold text-stone-600 mb-1">{comingSoonTitle}</h3>
                <p className="text-sm text-stone-400">{comingSoonSubtitle}</p>
              </div>
            )}
         </div>
      </section>
    );
  }

  if (type === 'faq') {
    return (
      <section id={`section-${sectionIndex}`} className={`py-20 px-6 ${theme.bg}`}>
         <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-10">
               <h2 className={`font-serif text-3xl ${theme.text}`}>{data.title}</h2>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.items?.map((item: any, idx: number) => (
               <div key={idx} className={`bg-white p-6 rounded-xl border ${theme.border} shadow-sm`}>
                  <h3 className={`font-serif text-lg ${theme.text} mb-2`}>{item.q}</h3>
                  <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{item.a}</p>
               </div>
            ))}
         </div>
      </section>
    );
  }

  if (type === 'text') {
     return (
        <section id={`section-${sectionIndex}`} className="py-20 px-6 bg-white text-center">
           <div className="max-w-2xl mx-auto">
              <h2 className={`font-serif text-3xl ${theme.text} mb-4`}>{data.title}</h2>
              <p className={`text-lg ${theme.textMuted} leading-relaxed`}>{data.subtitle}</p>
           </div>
        </section>
     );
  }

  if (type === 'rsvp') {
    // Use translatable labels from data, with English fallbacks
    const respondByLabel = data.respondByLabel || 'Please respond by';
    const submitLabel = data.submitLabel || 'Send RSVP';
    const selectOptionLabel = data.selectOptionLabel || 'Select an option';
    const enterYourLabel = data.enterYourLabel || 'Enter your';

    return (
      <section id={`section-${sectionIndex}`} className={`py-20 px-6 ${theme.bg}`}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 ${theme.accentLight} ${theme.accent} rounded-full text-[10px] font-bold uppercase tracking-wide mb-4`}>
              <Heart size={12} /> RSVP
            </div>
            <h2 className={`font-serif text-4xl ${theme.text} mb-2`}>{data.title}</h2>
            {data.subtitle && <p className={`${theme.textMuted}`}>{data.subtitle}</p>}
            {data.deadline && (
              <p className={`text-sm ${theme.accent} mt-2`}>
                {respondByLabel} {data.deadline}
              </p>
            )}
          </div>
          
          <form className={`bg-white p-8 rounded-2xl shadow-lg border ${theme.border}`}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.fields?.map((field: any, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={`${enterYourLabel} ${field.label.toLowerCase()}...`}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border ${theme.border} focus:ring-2 focus:ring-amber-500 outline-none resize-none`}
                  />
                ) : field.type === 'select' ? (
                  <select className={`w-full px-4 py-3 rounded-lg border ${theme.border} focus:ring-2 focus:ring-amber-500 outline-none bg-white`}>
                    <option value="">{selectOptionLabel}</option>
                    {field.options?.map((opt: string, optIdx: number) => (
                      <option key={optIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={`${enterYourLabel} ${field.label.toLowerCase()}...`}
                    className={`w-full px-4 py-3 rounded-lg border ${theme.border} focus:ring-2 focus:ring-amber-500 outline-none`}
                  />
                )}
              </div>
            ))}
            
            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-lg ${theme.button} transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return null;
};

// --- SMALL HELPERS ---

interface CountdownSimpleProps {
  val: number;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}

const CountdownSimple: React.FC<CountdownSimpleProps> = ({ val, label, theme }) => (
  <div className="text-center">
    <span className={`block font-serif text-3xl ${theme.text}`}>{val}</span>
    <span className="text-[10px] uppercase tracking-widest text-stone-400">{label}</span>
  </div>
);

interface CountdownImmersiveProps {
  val: number;
  label: string;
}

const CountdownImmersive: React.FC<CountdownImmersiveProps> = ({ val, label }) => (
  <div className="text-center">
    <span className="block font-serif text-2xl text-white">{String(val).padStart(2,'0')}</span>
    <span className="text-[10px] uppercase tracking-widest text-white/60">{label}</span>
  </div>
);

export default WeddingPreview;