import { ThemeCard } from './ThemeCard';
import { SectionHeader } from './SectionHeader';
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
    image: 'https://images.unsplash.com/photo-1519225468359-2996bc01c326?q=80&w=600&auto=format&fit=crop',
    accent: 'rose',
    features: ['Minimal', 'Elegant', 'Modern'],
    defaultTitle: 'Vogue',
  },
  {
    key: 'arch',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    accent: 'amber',
    features: ['Warm', 'Romantic', 'Soft'],
    defaultTitle: 'Arch',
  },
  {
    key: 'immersive',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop',
    accent: 'stone',
    features: ['Bold', 'Dramatic', 'Full-screen'],
    defaultTitle: 'Immersive',
  },
  {
    key: 'classic',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop',
    accent: 'emerald',
    features: ['Timeless', 'Traditional', 'Clean'],
    defaultTitle: 'Classic',
  },
] as const;

export const ThemesSection: React.FC<ThemesSectionProps> = ({ translations: t }) => {
  const themes = t.landing.themes;

  return (
    <section id="themes" className="py-32 px-6 bg-gradient-to-b from-[#FAFAF9] to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={themes?.title || 'Themes that stun'}
          subtitle={themes?.subtitle || 'Editorial designs usually reserved for magazines.'}
          badge="Premium Themes"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.key}
            title={(themes as Record<string, string>)?.[theme.key] || theme.defaultTitle}
            image={theme.image}
            accent={theme.accent}
            features={theme.features}
          />
        ))}
      </div>
    </section>
  );
};

export default ThemesSection;
