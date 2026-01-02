'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, Menu, X, Music, Share2, UploadCloud, Heart, ArrowRight, Palette, Check, Layout, Camera, Star, Edit3, Image as ImageIcon, Type, Smartphone, Plus, Trash2, HelpCircle, Save, AlignLeft, Grid, GripVertical, Gift, Cake, Wine, Car, Plane, Home, Mail, Globe, QrCode, LayoutDashboard } from 'lucide-react';
import { useMap } from 'react-leaflet';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { WeddingData, Section } from '@/lib/types';
import { THEMES, LAYOUTS, SECTION_TYPES, EVENT_ICONS } from '@/lib/constants';
import WeddingPreview from './WeddingPreview';
import AlbumManager from './AlbumManager';
import AssetUploader from './AssetUploader';
import QRCodeGenerator from './QRCodeGenerator';
import { getTranslations, TranslationKeys } from '@/lib/i18n/translations';
import { Locale, defaultLocale } from '@/lib/i18n/config';
import { saveSite, getUserSite } from '@/actions/sites';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Fix for default markers in Leaflet
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// --- INITIAL DATA STRUCTURE ---

const INITIAL_DATA: WeddingData = {
  config: {
    selectedTheme: 'gold',
    selectedLayout: 'immersive',
    targetDate: 'May 10, 2026 16:00:00',
  },
  global: {
    bride: 'Sara',
    groom: 'Mladen',
    initials: 'S & M',
    dateFull: '10. Svibnja 2026.',
    dateTime: '16:00',
    locationCity: 'Zagreb',
    locationCountry: 'Croatia',
    heroTitle: 'Rezervirajte Datum',
    heroImage: 'https://images.unsplash.com/photo-1519225468359-2996bc01c326?q=80&w=2000&auto=format&fit=crop',
    navLabels: ['Detalji', 'Info', 'Slike'],
    footerLinks: ['Instagram', 'Email', 'Karta'],
    copyright: '© 2026 Sara & Mladen • Zagreb'
  },
  sections: [
    {
      id: 'sec_1',
      type: 'events',
      name: 'Timeline',
      data: {
        title: 'Vikend',
        subtitle: 'Pridružite nam se u proslavi ljubavi.',
        items: [
          { id: 1, title: 'Obred Vjenčanja', time: '16:00 H', location: 'Crkva Sv. Marka', description: 'Gornji Grad', iconType: 'clock', coordinates: { lat: 45.8150, lng: 15.9775 }, albumId: 'ceremony_album' },
          { id: 2, title: 'Svadbena Večera', time: '18:00 H', location: 'Hotel Esplanade', description: 'Smaragdna dvorana', iconType: 'music', coordinates: { lat: 45.8078, lng: 15.9676 }, albumId: 'reception_album' }
        ]
      }
    },
    {
      id: 'sec_2',
      type: 'photos',
      name: 'Photos',
      data: {
        title: 'Vaše fotografije, <br/>naša sjećanja.',
        subtitle: 'Pomozite nam prikupiti sve trenutke s vjenčanja.',
        buttonLabel: 'Google Photos Album',
        image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2000&auto=format&fit=crop'
      }
    },
    {
      id: 'sec_3',
      type: 'faq',
      name: 'FAQ',
      data: {
        title: 'Česta Pitanja',
        items: [
          { q: "Što odjenuti?", a: "Svečana odjeća." },
          { q: "Jesu li djeca pozvana?", a: "Događaj samo za odrasle." }
        ]
      }
    }
  ]
};

// --- MAIN APP ---

interface BuilderAppProps {
  locale?: Locale;
}

const BuilderApp = ({ locale = defaultLocale }: BuilderAppProps) => {
  const t = getTranslations(locale);
  const { isSignedIn, user: clerkUser } = useUser();
  const [data, setData] = useState<WeddingData>(INITIAL_DATA);
  const [subdomain, setSubdomain] = useState('sara-mladen');
  const [isSubdomainLocked, setIsSubdomainLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load site data using server action if user is signed in
        if (isSignedIn) {
          const result = await getUserSite();
          if (result.success && result.data) {
            setData(result.data);
            if (result.subdomain) {
              setSubdomain(result.subdomain);
            }
            // Lock subdomain if site has been saved before
            if (result.isSubdomainLocked) {
              setIsSubdomainLocked(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isSignedIn]);

  // -- State Updaters --

  const updateGlobal = (field: string, value: any) => {
    setData(prev => {
      const newGlobal = { ...prev.global, [field]: value };
      // Auto-suggest subdomain when bride or groom changes (only if subdomain hasn't been locked and hasn't been manually edited)
      if (!isSubdomainLocked && (field === 'bride' || field === 'groom') && subdomain === `${prev.global.bride.toLowerCase()}-${prev.global.groom.toLowerCase()}`) {
        const newSubdomain = `${field === 'bride' ? value : newGlobal.bride}-${field === 'groom' ? value : newGlobal.groom}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        setSubdomain(newSubdomain);
      }
      return { ...prev, global: newGlobal };
    });
  };

  const updateConfig = (field: string, value: any) => {
    setData(prev => ({ ...prev, config: { ...prev.config, [field]: value } }));
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      id: `sec_${Date.now()}`,
      type: type as Section['type'],
      data: getDefaultSectionData(type)
    };
    setData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    setIsAddModalOpen(false);
  };

  const deleteSection = (id: string) => {
    setData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const updateSection = (id: string, updatedSection: Section) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? updatedSection : s)
    }));
  };

  const updateSectionData = (id: string, newData: any) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, data: newData } : s)
    }));
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      // Will be handled by SignInButton wrapper
      return;
    }

    try {
      const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const result = await saveSite(data, cleanSubdomain);

      if (result.success) {
        // Lock subdomain after first successful save
        setIsSubdomainLocked(true);
        alert(t.builder.saveSuccess?.replace('{subdomain}', cleanSubdomain) || `Site saved! It will be available at ${cleanSubdomain}.wdng.online`);
      } else {
        alert(result.error || t.common.error || "Failed to save configuration");
      }
    } catch (error) {
      console.error('Error saving site:', error);
      alert(t.common.error || "Error saving configuration");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const body = isLogin
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, password: authPassword };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setShowAuthModal(false);
        // Reset form
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setAuthConfirmPassword('');
        // Reload site data
        const siteResponse = await fetch('http://localhost:3001/me/site', {
          credentials: 'include',
        });
        if (siteResponse.ok) {
          const result = await siteResponse.json();
          if (result.data) {
            setData(result.data);
          }
        }
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setUser(null);
      // Reset to initial data
      setData(INITIAL_DATA);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newSections = [...data.sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);

    setData(prev => ({ ...prev, sections: newSections }));
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Splitter drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const container = document.querySelector('.builder-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;

    // Constrain between 25% and 75% to ensure both panels remain usable
    const constrainedPosition = Math.max(25, Math.min(75, newPosition));
    setSplitPosition(constrainedPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPosition(prev => Math.max(25, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPosition(prev => Math.min(75, prev + 5));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  if (isMobile) return <MobileWarning />;

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-stone-800 builder-container">

      {/* LEFT: BUILDER PANEL */}
      <div
        className="h-full flex flex-col border-r border-stone-200 bg-stone-50"
        style={{ width: `${splitPosition}%` }}
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-400 rounded-lg blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                <Image src="/logo.png" alt="wdng online" width={40} height={40} className="rounded-lg relative shadow-md group-hover:scale-105 transition-transform" />
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2"><Edit3 size={18} className="text-amber-600"/> {t.builder.title}</h1>
              {isSignedIn && clerkUser && <p className="text-xs text-stone-500">{t.builder.welcome}, {clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowQRCode(true)} 
              className="flex items-center gap-2 p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              title="Get QR Code"
            >
              <QrCode size={18} />
            </button>
            <SignedIn>
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<LayoutDashboard size={16} />}
                    href={`/${locale}/dashboard`}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-2 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
                  {t.nav.signIn}
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">

          {/* 1. Global Configuration */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><Layout size={16}/> {t.builder.globalSettings}</h2>

            {/* Theme Selector */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">{t.builder.theme}</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateConfig('selectedTheme', theme.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group cursor-pointer overflow-hidden ${
                      data.config.selectedTheme === theme.id
                        ? 'border-stone-800 shadow-lg scale-105 bg-gradient-to-br from-stone-50 to-white'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-md hover:scale-102 bg-white'
                    }`}
                  >
                    {/* Color Palette Preview */}
                    <div className="flex gap-1 mb-3">
                      <div className={`w-4 h-4 rounded-full border border-white shadow-sm ${
                        theme.id === 'gold' ? 'bg-amber-500' :
                        theme.id === 'blue' ? 'bg-blue-500' :
                        theme.id === 'rose' ? 'bg-rose-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className={`w-4 h-4 rounded-full border border-white shadow-sm ${
                        theme.id === 'gold' ? 'bg-amber-100' :
                        theme.id === 'blue' ? 'bg-blue-100' :
                        theme.id === 'rose' ? 'bg-rose-100' :
                        'bg-green-100'
                      }`}></div>
                      <div className={`w-4 h-4 rounded-full border border-white shadow-sm ${
                        theme.id === 'gold' ? 'bg-stone-100' :
                        theme.id === 'blue' ? 'bg-slate-100' :
                        theme.id === 'rose' ? 'bg-pink-50' :
                        'bg-stone-100'
                      }`}></div>
                    </div>

                    {/* Theme Name */}
                    <div className="text-left">
                      <h3 className={`font-bold text-sm ${theme.colors.text} mb-1`}>{theme.label}</h3>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                        {theme.description}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    {data.config.selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center animate-pulse">
                        <Check size={12} className="text-white" />
                      </div>
                    )}

                    {/* Hover Indicator */}
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                      data.config.selectedTheme === theme.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-10'
                    } bg-stone-800`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Selector */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Layout</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(LAYOUTS).map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => updateConfig('selectedLayout', layout.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group cursor-pointer overflow-hidden ${
                      data.config.selectedLayout === layout.id
                        ? 'border-stone-800 shadow-lg scale-105 bg-gradient-to-br from-stone-50 to-white'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-md hover:scale-102 bg-white'
                    }`}
                  >
                    {/* Layout Preview */}
                    <div className="w-full h-12 bg-stone-50 rounded-lg mb-3 flex items-center justify-center border border-stone-100 relative overflow-hidden">
                      {layout.id === 'immersive' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300">
                          <div className="absolute top-1 left-1 right-1 h-2 bg-stone-800 rounded-full opacity-20"></div>
                          <div className="absolute bottom-1 left-1 right-1 h-1 bg-stone-600 rounded-full opacity-30"></div>
                        </div>
                      )}
                      {layout.id === 'arch' && (
                        <div className="relative">
                          <div className="w-8 h-8 border-2 border-stone-400 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                        </div>
                      )}
                      {layout.id === 'vogue' && (
                        <div className="flex flex-col items-center space-y-0.5">
                          <div className="flex space-x-0.5">
                            <div className="w-1.5 h-4 bg-stone-400 rounded-sm"></div>
                            <div className="w-1.5 h-3 bg-stone-300 rounded-sm"></div>
                            <div className="w-1.5 h-4 bg-stone-400 rounded-sm"></div>
                          </div>
                          <div className="w-6 h-0.5 bg-stone-300 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Layout Name */}
                    <div className="text-left">
                      <h3 className="font-bold text-sm text-stone-800 mb-1">{layout.label}</h3>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                        {layout.description}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    {data.config.selectedLayout === layout.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center animate-pulse">
                        <Check size={12} className="text-white" />
                      </div>
                    )}

                    {/* Hover Indicator */}
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                      data.config.selectedLayout === layout.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-10'
                    } bg-stone-800`}></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               {/* Subdomain Input */}
               <div className={`p-4 rounded-xl border ${isSubdomainLocked ? 'bg-stone-100 border-stone-200' : 'bg-amber-50 border-amber-200'}`}>
                 <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${isSubdomainLocked ? 'text-stone-500' : 'text-amber-700'}`}>
                   <Globe size={12} /> {t.builder.yourUrl}
                   {isSubdomainLocked && <span className="ml-2 px-1.5 py-0.5 bg-stone-200 text-stone-600 rounded text-[8px]">{t.builder.urlLocked || 'LOCKED'}</span>}
                 </label>
                 <div className="flex items-center gap-2">
                   <input 
                     type="text" 
                     value={subdomain} 
                     onChange={(e) => !isSubdomainLocked && setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                     placeholder="sara-mladen"
                     disabled={isSubdomainLocked}
                     className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium outline-none ${
                       isSubdomainLocked 
                         ? 'border-stone-300 text-stone-500 bg-stone-50 cursor-not-allowed' 
                         : 'border-amber-300 text-stone-800 bg-white focus:ring-2 focus:ring-amber-500'
                     }`}
                   />
                   <span className={`text-sm font-medium ${isSubdomainLocked ? 'text-stone-500' : 'text-amber-700'}`}>.wdng.online</span>
                 </div>
                 <p className={`text-[10px] mt-2 ${isSubdomainLocked ? 'text-stone-500' : 'text-amber-600'}`}>
                   {isSubdomainLocked ? (t.builder.urlLockedHint || 'Your subdomain cannot be changed after the first save.') : t.builder.urlHint}
                 </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <InputField label={t.builder.bride} value={data.global.bride} onChange={(v) => updateGlobal('bride', v)} />
                 <InputField label={t.builder.groom} value={data.global.groom} onChange={(v) => updateGlobal('groom', v)} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <InputField label={t.builder.date} value={data.global.dateFull} onChange={(v) => updateGlobal('dateFull', v)} />
                 <InputField label={t.builder.time} value={data.global.dateTime} onChange={(v) => updateGlobal('dateTime', v)} />
               </div>
               <InputField label={t.builder.location} value={data.global.locationCity} onChange={(v) => updateGlobal('locationCity', v)} />

               <div className="pt-4 border-t border-stone-100">
                 <ImageUpload label={t.builder.heroImage} currentImage={data.global.heroImage} onUpload={(url) => updateGlobal('heroImage', url)} />
               </div>
            </div>
          </section>

          {/* 2. Sections Manager */}
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-stone-800">{t.builder.sections.title}</h2>
             <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1 text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-full hover:bg-amber-700 shadow-lg shadow-amber-600/20 transform hover:-translate-y-0.5 transition-all">
               <Plus size={14}/> {t.builder.sections.add}
             </button>
          </div>

          <div className="space-y-4">
            {data.sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`${draggedIndex === index ? 'opacity-50' : ''} transition-opacity`}
              >
                <SectionEditor
                  section={section}
                  index={index}
                  translations={t}
                  onDelete={() => deleteSection(section.id)}
                  onUpdate={(newData) => updateSectionData(section.id, newData)}
                  onUpdateSection={(updatedSection) => updateSection(section.id, updatedSection)}
                />
              </div>
            ))}
            {data.sections.length === 0 && (
              <div className="p-8 border-2 border-dashed border-stone-200 rounded-2xl text-center text-stone-400 text-sm">
                {t.builder.sections.empty}
              </div>
            )}
          </div>

        </div>

        {/* Save Button - Fixed at bottom */}
        <div className="p-4 bg-white border-t border-stone-200 sticky bottom-0">
          {isSignedIn ? (
            <button 
              onClick={handleSave} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
            >
              <Save size={18} /> {t.builder.save}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-amber-700 transition-colors shadow-lg">
                <Save size={18} /> {t.builder.signInToSave}
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* RESIZABLE SPLITTER */}
      <div
        className="w-1 bg-stone-300 hover:bg-stone-400 active:bg-stone-500 focus:bg-stone-400 cursor-col-resize transition-colors relative group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-inset"
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="separator"
        aria-label="Resize builder and preview panels"
      >
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-8 -mx-4 group-hover:bg-stone-200/50 group-focus:bg-stone-200/50 rounded"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <div className="w-0.5 h-6 bg-stone-500 rounded-full mb-1"></div>
          <div className="w-0.5 h-6 bg-stone-500 rounded-full"></div>
        </div>
      </div>

      {/* RIGHT: PREVIEW PANEL */}
      <div
        className="h-full bg-stone-200 relative flex flex-col shadow-inner"
        style={{ width: `${100 - splitPosition}%` }}
      >
        <div className="bg-stone-800 text-white text-[10px] py-1 text-center font-mono uppercase tracking-widest z-10">Live Preview</div>
        <div className="flex-1 overflow-y-auto relative scroll-smooth" id="preview-container">
          <WeddingPreview data={data} isPreview={true} />
        </div>
      </div>

      {/* ADD SECTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <h3 className="font-bold text-stone-800">Add New Section</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-stone-400 hover:text-stone-800"/></button>
            </div>
            <div className="p-2">
              {Object.entries(SECTION_TYPES).map(([type, info]) => {
                const isAlreadyAdded = data.sections.some(s => s.type === type);
                return (
                  <button
                    key={type}
                    onClick={() => !isAlreadyAdded && addSection(type)}
                    disabled={isAlreadyAdded}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left group ${
                      isAlreadyAdded 
                        ? 'opacity-40 cursor-not-allowed bg-stone-50' 
                        : 'hover:bg-stone-50 cursor-pointer'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isAlreadyAdded 
                        ? 'bg-stone-100 text-stone-400' 
                        : 'bg-stone-100 text-stone-500 group-hover:bg-amber-100 group-hover:text-amber-600'
                    }`}>
                      {getIconComponent(info.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-800 text-sm">{info.label}</div>
                      <div className="text-xs text-stone-400">
                        {isAlreadyAdded ? t.builder.sections.alreadyAdded : t.builder.sections.addToPage}
                      </div>
                    </div>
                    {isAlreadyAdded ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Plus size={16} className="text-stone-300 group-hover:text-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {showQRCode && (
        <QRCodeGenerator 
          subdomain={subdomain} 
          onClose={() => setShowQRCode(false)} 
        />
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required={!isLogin}
                  />
                </div>
              )}

              {authError && (
                <p className="text-red-600 text-sm">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-stone-900 text-white py-2.5 rounded-lg font-bold hover:bg-stone-800 disabled:opacity-50"
              >
                {authLoading ? 'Please wait...' : (isLogin ? 'Log in' : 'Sign up')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-stone-600 hover:text-stone-900 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- BUILDER SUB-COMPONENTS ---

const SectionEditor = ({ section, index, translations: t, onDelete, onUpdate, onUpdateSection }: { section: any; index: number; translations: TranslationKeys; onDelete: () => void; onUpdate: (newData: any) => void; onUpdateSection: (updatedSection: any) => void }) => {
  const typeInfo = SECTION_TYPES[section.type as keyof typeof SECTION_TYPES];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4 flex items-center justify-between bg-white cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-stone-100 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} className="text-stone-400" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
            {getIconComponent(typeInfo.icon)}
          </div>
          <span className="font-bold text-sm text-stone-700">{typeInfo.label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] uppercase font-bold text-stone-300 mr-2">Section {index + 1}</span>
           <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label={t.builder.sectionName} value={section.name || ''} onChange={(v) => {
              onUpdateSection({ ...section, name: v });
            }} />
            <InputField label={t.builder.sectionTitle} value={section.data.title} onChange={(v) => onUpdate({ title: v })} />
          </div>
          {section.type !== 'faq' && <InputField label={t.builder.subtitle} value={section.data.subtitle} onChange={(v) => onUpdate({ subtitle: v })} />}

          {/* Type Specific Fields */}
          {section.type === 'photos' && (
            <div className="space-y-4">
              <ImageUpload label={t.builder.backgroundPhoto} currentImage={section.data.image} onUpload={(url) => onUpdate({ ...section.data, image: url })} />
              
              <div className="pt-4 border-t border-stone-200">
                <AlbumManager
                  albumId={section.data.albumId}
                  albumUrl={section.data.albumUrl}
                  onAlbumCreated={(albumId, albumUrl) => onUpdate({ ...section.data, albumId, albumUrl })}
                />
              </div>
            </div>
          )}

          {section.type === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">{t.builder.timelineEvents}</label>
                <button onClick={() => {
                  const newItem = {
                    id: Date.now(),
                    title: t.builder.newEvent || 'New Event',
                    time: '00:00',
                    location: t.builder.location,
                    description: '',
                    iconType: 'clock',
                    coordinates: { lat: 0, lng: 0 },
                    albumId: ''
                  };
                  onUpdate({ items: [...(section.data.items || []), newItem] });
                }} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  <Plus size={12} /> {t.builder.addEvent}
                </button>
              </div>

              <div className="space-y-3">
                {section.data.items?.map((item: any, idx: number) => (
                  <EventItemEditor
                    key={item.id}
                    item={item}
                    index={idx}
                    onUpdate={(updatedItem) => {
                      const newItems = [...section.data.items];
                      newItems[idx] = updatedItem;
                      onUpdate({ items: newItems });
                    }}
                    onDelete={() => {
                      const newItems = section.data.items.filter((i: any) => i.id !== item.id);
                      onUpdate({ items: newItems });
                    }}
                    onMove={(fromIndex, toIndex) => {
                      const newItems = [...section.data.items];
                      const [movedItem] = newItems.splice(fromIndex, 1);
                      newItems.splice(toIndex, 0, movedItem);
                      onUpdate({ items: newItems });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {section.type === 'faq' && (
            <div className="space-y-3 pt-2">
               <label className="block text-xs font-bold text-stone-400 uppercase">{t.builder.questions}</label>
               {section.data.items?.map((item: any, idx: number) => (
                 <div key={idx} className="p-3 bg-white border border-stone-200 rounded-lg space-y-2 relative group">
                    <button onClick={() => {
                        const newItems = section.data.items.filter((_: any, i: number) => i !== idx);
                        onUpdate({ items: newItems });
                    }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                    <InputField label={t.builder.question} value={item.q} onChange={(v) => {
                        const newItems = [...section.data.items]; newItems[idx].q = v; onUpdate({ items: newItems });
                    }} />
                    <InputField label={t.builder.answer} value={item.a} onChange={(v) => {
                        const newItems = [...section.data.items]; newItems[idx].a = v; onUpdate({ items: newItems });
                    }} />
                 </div>
               ))}
               <button onClick={() => {
                  onUpdate({ items: [...(section.data.items || []), { q: t.builder.newQuestion || 'New Question?', a: t.builder.answerPlaceholder || 'Answer here.' }] });
               }} className="w-full py-2 border border-dashed border-stone-300 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100">+ {t.builder.addQuestion}</button>
            </div>
          )}

          {section.type === 'rsvp' && (
            <div className="space-y-4 pt-2">
               <InputField label={t.builder.responseDeadline} value={section.data.deadline || ''} onChange={(v) => onUpdate({ ...section.data, deadline: v })} />
               
               <div>
                 <div className="flex items-center justify-between mb-2">
                   <label className="block text-xs font-bold text-stone-400 uppercase">{t.builder.formFields}</label>
                   <button 
                     onClick={() => {
                       const newField = { id: `field_${Date.now()}`, label: t.builder.label, type: 'text', required: false };
                       onUpdate({ ...section.data, fields: [...(section.data.fields || []), newField] });
                     }}
                     className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                   >
                     <Plus size={12} /> {t.builder.addField}
                   </button>
                 </div>
                 
                 {section.data.fields?.map((field: any, idx: number) => (
                   <div key={field.id} className="p-3 bg-white border border-stone-200 rounded-lg space-y-2 relative group mb-2">
                     <button onClick={() => {
                       const newFields = section.data.fields.filter((f: any) => f.id !== field.id);
                       onUpdate({ ...section.data, fields: newFields });
                     }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">
                       <Trash2 size={14}/>
                     </button>
                     
                     <div className="grid grid-cols-2 gap-2">
                       <InputField label={t.builder.label} value={field.label} onChange={(v) => {
                         const newFields = [...section.data.fields];
                         newFields[idx].label = v;
                         onUpdate({ ...section.data, fields: newFields });
                       }} />
                       <div>
                         <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{t.builder.type}</label>
                         <select
                           value={field.type}
                           onChange={(e) => {
                             const newFields = [...section.data.fields];
                             newFields[idx].type = e.target.value;
                             onUpdate({ ...section.data, fields: newFields });
                           }}
                           className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500"
                         >
                           <option value="text">{t.builder.fieldTypes.text}</option>
                           <option value="email">{t.builder.fieldTypes.email}</option>
                           <option value="select">{t.builder.fieldTypes.select}</option>
                           <option value="textarea">{t.builder.fieldTypes.textarea}</option>
                         </select>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                       <label className="flex items-center gap-2 text-sm">
                         <input
                           type="checkbox"
                           checked={field.required}
                           onChange={(e) => {
                             const newFields = [...section.data.fields];
                             newFields[idx].required = e.target.checked;
                             onUpdate({ ...section.data, fields: newFields });
                           }}
                           className="rounded border-stone-300"
                         />
                         <span className="text-stone-600">{t.builder.required}</span>
                       </label>
                     </div>
                     
                     {field.type === 'select' && (
                       <div>
                         <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Options (comma separated)</label>
                         <input
                           type="text"
                           value={(field.options || []).join(', ')}
                           onChange={(e) => {
                             const newFields = [...section.data.fields];
                             newFields[idx].options = e.target.value.split(',').map((o: string) => o.trim()).filter(Boolean);
                             onUpdate({ ...section.data, fields: newFields });
                           }}
                           placeholder="Option 1, Option 2, Option 3"
                           className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 outline-none focus:ring-2 focus:ring-amber-500"
                         />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MAP CLICK HANDLER COMPONENT ---

const MapClickHandler = dynamic(() => import('./MapClickHandler'), { ssr: false });

// --- LOCATION SELECTOR DIALOG ---

// --- LOCATION SELECTOR DIALOG ---

const LocationSelectorDialog = ({
  currentLocation,
  currentCoordinates,
  onSelect,
  onClose
}: {
  currentLocation: string;
  currentCoordinates: { lat: number; lng: number } | undefined;
  onSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [selectedCoordinates, setSelectedCoordinates] = useState(currentCoordinates || { lat: 45.8150, lng: 15.9775 });
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Component to handle map centering
  const MapCenterHandler = ({ coordinates }: { coordinates: { lat: number; lng: number } }) => {
    const map = useMap();
    
    useEffect(() => {
      if (coordinates && map) {
        map.setView([coordinates.lat, coordinates.lng], 15);
      }
    }, [coordinates, map]);
    
    return null;
  };

  // Search using OpenStreetMap Nominatim API with suggestions
  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSearchSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = (query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 200); // 200ms delay - faster response
    setSearchTimeout(timeout);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    const newCoords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    setSelectedCoordinates(newCoords);
    // Don't set searchQuery - let user type custom name
    setShowSuggestions(false);

    // Map will be centered automatically by the useEffect when coordinates change
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng });
    setShowSuggestions(false);
  };

  const handleMarkerDragEnd = (event: any) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setSelectedCoordinates({ lat: position.lat, lng: position.lng });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center">
          <h3 className="font-bold text-stone-800">Select Location</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X size={20} />
          </button>
        </div>

        {/* Search Suggestions Dropdown - positioned at top of modal */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="mx-4 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur from firing
                  handleSuggestionSelect(suggestion);
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-50 border-b border-stone-100 last:border-b-0 focus:bg-stone-50 focus:outline-none transition-colors"
              >
                <div className="text-sm font-medium text-stone-800 truncate">
                  {suggestion.display_name}
                </div>
                <div className="text-xs text-stone-500">
                  {suggestion.type && `${suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}`}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative p-4 border-b border-stone-100">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Type a custom name for this location..."
                className={`w-full px-3 py-2 rounded-lg border text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  selectedCoordinates ? 'border-green-500 bg-green-50' : 'border-stone-200'
                }`}
              />
              {selectedCoordinates && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                  <Check size={16} />
                </div>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="relative h-96 bg-stone-100">
          <MapContainer
            center={[45.8150, 15.9775]} // Fixed initial center
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenReady={() => {
              // Map is ready, but we can't set it here directly
              // We'll use useMap hook in a child component instead
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            <MapCenterHandler coordinates={selectedCoordinates} />
            <Marker
              position={[selectedCoordinates.lat, selectedCoordinates.lng]}
              draggable={true}
              eventHandlers={{
                dragend: (event: any) => {
                  const marker = event.target;
                  const position = marker.getLatLng();
                  setSelectedCoordinates({ lat: position.lat, lng: position.lng });
                },
              }}
            >
              <Popup>
                Selected Location<br />
                {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
              </Popup>
            </Marker>
          </MapContainer>

          {/* Coordinates display */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-mono text-stone-600">
              {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs text-stone-600">
              Click on the map or drag the marker to select location
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex justify-between items-center">
          <div className="text-sm text-stone-600">
            Selected: <span className="font-medium">{searchQuery || 'Custom Location'}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSelect(searchQuery, selectedCoordinates)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Select Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EVENT ITEM EDITOR ---

const EventItemEditor = ({ item, index, onUpdate, onDelete, onMove }: {
  item: any;
  index: number;
  onUpdate: (updatedItem: any) => void;
  onDelete: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setIsDragging(false);

    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== index) {
      onMove(fromIndex, index);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOver(false);
  };

  const handleLocationSelect = (location: string, coordinates: { lat: number; lng: number }) => {
    onUpdate({ ...item, location, coordinates });
    setShowLocationDialog(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={`relative p-4 bg-white border border-stone-200 rounded-lg space-y-3 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${dragOver ? 'border-amber-400 bg-amber-50' : ''} group`}
    >
      {/* Drag Handle & Delete */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-stone-100 rounded">
            <GripVertical size={14} className="text-stone-400" />
          </div>
          <span className="text-xs font-bold text-stone-400 uppercase">Event {index + 1}</span>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Icon Selector */}
      <div>
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Icon</label>
        <div className="relative">
          <select
            value={item.iconType}
            onChange={(e) => onUpdate({ ...item, iconType: e.target.value })}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
          >
            {EVENT_ICONS.map((icon) => (
              <option key={icon.id} value={icon.id}>
                {icon.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {getIconComponent(EVENT_ICONS.find(icon => icon.id === item.iconType)?.icon || 'Clock')}
          </div>
        </div>
      </div>

      {/* Basic Fields */}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Title"
          value={item.title}
          onChange={(v) => onUpdate({ ...item, title: v })}
        />
        <InputField
          label="Time"
          value={item.time}
          onChange={(v) => onUpdate({ ...item, time: v })}
        />
      </div>

      {/* Location Selector */}
      <div>
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={item.location}
            onChange={(e) => onUpdate({ ...item, location: e.target.value })}
            placeholder="Click map to select location"
            className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            readOnly
          />
          <button
            onClick={() => setShowLocationDialog(true)}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            title="Select location on map"
          >
            <MapPin size={16} className="text-stone-600" />
          </button>
        </div>
        {(item.coordinates?.lat && item.coordinates?.lng) && (
          <div className="mt-1 text-[10px] text-stone-500">
            {item.coordinates.lat.toFixed(6)}, {item.coordinates.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Album Connection */}
      <div>
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Photo Album ID</label>
        <input
          type="text"
          value={item.albumId || ''}
          onChange={(e) => onUpdate({ ...item, albumId: e.target.value })}
          placeholder="e.g., ceremony_album"
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Description (Optional)</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          placeholder="Additional details about this event..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
        />
      </div>
    </div>

    {/* Location Selector Dialog */}
    {showLocationDialog && (
      <LocationSelectorDialog
        currentLocation={item.location}
        currentCoordinates={item.coordinates}
        onSelect={handleLocationSelect}
        onClose={() => setShowLocationDialog(false)}
      />
    )}
    </>
  );
};

const getDefaultSectionData = (type: string) => {
  switch (type) {
    case 'events': return { title: 'Event Timeline', subtitle: 'Join us for the celebration', items: [{ id: 1, title: 'Ceremony', time: '16:00', location: 'Main Hall', iconType: 'clock' }] };
    case 'photos': return { title: 'Photo Gallery', subtitle: 'Share your memories', buttonLabel: 'Upload', image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2000&auto=format&fit=crop' };
    case 'faq': return { title: 'Q&A', items: [{ q: 'Question?', a: 'Answer.' }] };
    case 'text': return { title: 'Our Story', subtitle: 'Once upon a time...' };
    case 'rsvp': return { 
      title: 'Will you attend?', 
      subtitle: 'Please let us know if you can make it.',
      deadline: '',
      fields: [
        { id: 'name', label: 'Full Name', type: 'text', required: true },
        { id: 'email', label: 'Email', type: 'email', required: true },
        { id: 'attendance', label: 'Will you attend?', type: 'select', required: true, options: ['Yes, I will be there!', 'Sorry, I cannot attend'] },
        { id: 'dietary', label: 'Dietary Requirements', type: 'textarea', required: false }
      ]
    };
    default: return { title: 'New Section' };
  }
};

const InputField = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div>
    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{label}</label>
    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none" />
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: any; onChange: (value: string) => void }) => (
  <div>
    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-800 bg-white outline-none">
      {Object.values(options).map((opt: any) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
    </select>
  </div>
);

const ImageUpload = ({ label, currentImage, onUpload }: { label: string; currentImage: string; onUpload: (url: string) => void }) => {
  return (
    <div>
       <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">{label}</label>
       <div className="flex items-center gap-3">
         <div className="w-12 h-12 rounded-lg border border-stone-200 bg-stone-100 overflow-hidden"><img src={currentImage} className="w-full h-full object-cover" alt="Preview"/></div>
         <label className="cursor-pointer bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50">
            Upload Image <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(URL.createObjectURL(e.target.files[0]))} />
         </label>
       </div>
    </div>
  );
};

const MobileWarning = () => (
  <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-8 text-center">
    <Smartphone size={48} className="mb-4 text-amber-500" />
    <h1 className="text-2xl font-serif mb-2">Desktop Required</h1>
    <p className="text-stone-400">The Builder is optimized for larger screens.</p>
  </div>
);

// Helper function to get icon components
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    MapPin, Camera, HelpCircle, AlignLeft, Mail
  };
  const IconComponent = icons[iconName] || MapPin;
  return <IconComponent size={16} />;
};

export default BuilderApp;