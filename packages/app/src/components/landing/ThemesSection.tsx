'use client';

import { ThemeCard } from './ThemeCard';
import { SectionHeader } from './SectionHeader';
import { useScrollAnimation } from './useScrollAnimation';
import type { ThemesSectionProps, ThemeAccent } from './types';

// Theme configuration - easily extensible
interface ThemeConfig {
  key: string;
  image: string;
  accent: ThemeAccent;
  features: readonly string[];
  defaultTitle: string;
}

const THEMES: readonly ThemeConfig[] = [
  {
    key: 'vogue',
    image: '/images/theme-vogue.webp',
    accent: 'rose',
    features: ['Minimal', 'Elegant', 'Modern'],
    defaultTitle: 'Vogue',
  },
  {
    key: 'arch',
    image: '/images/theme-arch.webp',
    accent: 'amber',
    features: ['Warm', 'Romantic', 'Soft'],
    defaultTitle: 'Arch',
  },
  {
    key: 'immersive',
    image: '/images/theme-immersive.webp',
    accent: 'stone',
    features: ['Bold', 'Dramatic', 'Full-screen'],
    defaultTitle: 'Immersive',
  },
  {
    key: 'classic',
    image: '/images/theme-classic.webp',
    accent: 'emerald',
    features: ['Timeless', 'Traditional', 'Clean'],
    defaultTitle: 'Classic',
  },
] as const;

export const ThemesSection: React.FC<ThemesSectionProps> = ({ translations: t }) => {
  const { ref, isVisible } = useScrollAnimation();
  const themes = t.landing.themes;

  return (
    <section id="themes" className="py-24 sm:py-32 px-6 bg-gradient-to-b from-[#FAFAF9] to-white overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionHeader
          title={themes?.title || 'Themes that stun'}
          subtitle={themes?.subtitle || 'Editorial designs usually reserved for magazines.'}
          badge="Designer Themes"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {THEMES.map((theme, index) => (
          <div
            key={theme.key}
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <ThemeCard
              title={(themes as Record<string, string>)?.[theme.key] || theme.defaultTitle}
              image={theme.image}
              accent={theme.accent}
              features={theme.features}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThemesSection;
