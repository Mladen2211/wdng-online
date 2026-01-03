import Image from 'next/image';
import { Play, Check } from 'lucide-react';
import type { HeroSectionProps } from './types';

export const HeroSection: React.FC<HeroSectionProps> = ({ translations: t, onStartBuilding }) => (
  <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
    {/* Abstract Background Blobs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] -z-10 opacity-60" />
    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-50/50 rounded-full blur-[100px] -z-10 opacity-60" />

    <div className="max-w-5xl mx-auto text-center">
      <HeroTitle title={t.landing.hero.title} />

      <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        {t.landing.hero.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
        <button
          onClick={onStartBuilding}
          className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          {t.landing.hero.cta}
        </button>
        <button className="w-full sm:w-auto px-8 py-4 bg-white text-stone-700 border border-stone-200 rounded-full font-bold text-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
          <Play size={18} fill="currentColor" className="text-stone-300" />
          {t.landing.hero.secondaryCta}
        </button>
      </div>

      <BuilderMockup />
    </div>
  </header>
);

// Sub-component for the gradient hero title
const HeroTitle: React.FC<{ title: string }> = ({ title }) => {
  const words = title.split(' ');
  const mainWords = words.slice(0, -2).join(' ');
  const accentWords = words.slice(-2).join(' ');

  return (
    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-8 tracking-tight">
      {mainWords} <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-500 to-rose-400">
        {accentWords}
      </span>
    </h1>
  );
};

// Builder mockup component
const BuilderMockup: React.FC = () => (
  <div className="relative mx-auto max-w-6xl">
    <div className="relative rounded-2xl border border-stone-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white via-transparent to-transparent z-10 opacity-20" />

      {/* Browser Chrome */}
      <BrowserChrome />

      {/* Split Screen Content */}
      <div className="aspect-[16/9] bg-stone-100 rounded-b-xl overflow-hidden flex">
        <MockupSidebar />
        <MockupPreview />
      </div>
    </div>

    {/* Floating Badge */}
    <FloatingBadge />
  </div>
);

const BrowserChrome: React.FC = () => (
  <div className="h-8 bg-white border-b border-stone-100 rounded-t-xl flex items-center px-4 gap-2">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-400/80" />
      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
      <div className="w-3 h-3 rounded-full bg-green-400/80" />
    </div>
    <div className="mx-auto bg-stone-50 px-32 py-1 rounded-md text-[10px] text-stone-400 font-mono">
      wdng.online/editor
    </div>
  </div>
);

const MockupSidebar: React.FC = () => (
  <div className="w-1/3 bg-white border-r border-stone-200 p-6 hidden md:block text-left">
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-2 w-12 bg-stone-200 rounded" />
        <div className="h-10 w-full bg-stone-50 border border-stone-200 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-20 bg-stone-200 rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-amber-50 border-2 border-amber-500 rounded-lg" />
          <div className="h-16 bg-stone-50 border border-stone-100 rounded-lg" />
          <div className="h-16 bg-stone-50 border border-stone-100 rounded-lg" />
        </div>
      </div>
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-md shadow-sm" />
          <div className="h-2 w-24 bg-stone-200 rounded" />
        </div>
        <div className="h-2 w-full bg-stone-200 rounded mb-1" />
        <div className="h-2 w-2/3 bg-stone-200 rounded" />
      </div>
    </div>
  </div>
);

const MockupPreview: React.FC = () => (
  <div className="flex-1 bg-stone-200 p-8 flex items-center justify-center">
    <div className="w-[80%] h-[90%] bg-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
          fill
          className="object-cover opacity-90"
          alt="Preview"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl font-serif mb-2">Emma & Liam</div>
            <div className="text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md py-1 px-3 rounded-full">
              May 10, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FloatingBadge: React.FC = () => (
  <div
    className="absolute -right-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce hidden lg:block"
    style={{ animationDuration: '3s' }}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
        <Check size={20} />
      </div>
      <div>
        <div className="text-xs font-bold text-stone-800">Layout Saved</div>
        <div className="text-[10px] text-stone-400">Just now</div>
      </div>
    </div>
  </div>
);

export default HeroSection;
