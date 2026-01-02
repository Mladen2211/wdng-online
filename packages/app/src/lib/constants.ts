import { Theme, Layout } from './types';

export const THEMES: Record<string, Theme> = {
  gold: {
    id: 'gold',
    label: 'Luxe Gold',
    description: 'Elegant & Warm',
    colors: {
      bg: 'bg-[#F9F8F6]',
      text: 'text-stone-800',
      textMuted: 'text-stone-500',
      accent: 'text-amber-600',
      accentBg: 'bg-amber-600',
      accentLight: 'bg-amber-50',
      border: 'border-stone-200',
      gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#B48811] via-[#FCD34D] to-[#B48811]',
      button: 'bg-stone-900 text-white hover:bg-stone-700',
    }
  },
  blue: {
    id: 'blue',
    label: 'Adriatic Blue',
    description: 'Modern & Cool',
    colors: {
      bg: 'bg-slate-50',
      text: 'text-slate-800',
      textMuted: 'text-slate-500',
      accent: 'text-blue-600',
      accentBg: 'bg-blue-600',
      accentLight: 'bg-blue-50',
      border: 'border-slate-200',
      gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
    }
  },
  sage: {
    id: 'sage',
    label: 'Vintage Sage',
    description: 'Natural & Timeless',
    colors: {
      bg: 'bg-[#F0EFE9]',
      text: 'text-[#2C332E]',
      textMuted: 'text-[#6B7F73]',
      accent: 'text-[#5D7062]',
      accentBg: 'bg-[#5D7062]',
      accentLight: 'bg-[#E3E8E5]',
      border: 'border-[#D6D3C9]',
      gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#4A5D4F] via-[#8CA394] to-[#4A5D4F]',
      button: 'bg-[#4A5D4F] text-[#F2F0E9] hover:bg-[#3A4A3E]',
    }
  },
  rose: {
    id: 'rose',
    label: 'Rose Romantic',
    description: 'Soft & Dreamy',
    colors: {
      bg: 'bg-[#FDF8F8]',
      text: 'text-rose-900',
      textMuted: 'text-rose-400',
      accent: 'text-rose-500',
      accentBg: 'bg-rose-500',
      accentLight: 'bg-rose-50',
      border: 'border-rose-200',
      gradientText: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400',
      button: 'bg-rose-600 text-white hover:bg-rose-700',
    }
  }
};

export const LAYOUTS: Record<string, Layout> = {
  immersive: { id: 'immersive', label: 'Immersive', description: 'Full Screen Hero' },
  arch: { id: 'arch', label: 'The Arch', description: 'Classic Design' },
  vogue: { id: 'vogue', label: 'Vogue', description: 'Magazine Style' }
};

export const EVENT_ICONS = [
  { id: 'clock', label: 'Clock', icon: 'Clock' },
  { id: 'music', label: 'Music', icon: 'Music' },
  { id: 'heart', label: 'Heart', icon: 'Heart' },
  { id: 'camera', label: 'Camera', icon: 'Camera' },
  { id: 'map-pin', label: 'Location', icon: 'MapPin' },
  { id: 'star', label: 'Star', icon: 'Star' },
  { id: 'gift', label: 'Gift', icon: 'Gift' },
  { id: 'cake', label: 'Cake', icon: 'Cake' },
  { id: 'wine', label: 'Wine', icon: 'Wine' },
  { id: 'car', label: 'Car', icon: 'Car' },
  { id: 'plane', label: 'Plane', icon: 'Plane' },
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'utensils', label: 'Dinner', icon: 'UtensilsCrossed' },
  { id: 'church', label: 'Church', icon: 'Church' }
];

export const SECTION_TYPES = {
  events: { label: 'Timeline / Events', icon: 'MapPin', description: 'Schedule of your wedding day' },
  photos: { label: 'Photo Gallery', icon: 'Camera', description: 'Share photos with guests' },
  faq: { label: 'Q&A', icon: 'HelpCircle', description: 'Answer common questions' },
  text: { label: 'Rich Text', icon: 'AlignLeft', description: 'Custom text content' },
  rsvp: { label: 'RSVP Form', icon: 'Mail', description: 'Collect guest responses' },
};