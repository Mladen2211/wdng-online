import type { ReactNode } from 'react';
import type { TranslationKeys } from '@/lib/i18n/translations';
import type { Locale } from '@/lib/i18n/config';

// Theme accent colors type
export type ThemeAccent = 'rose' | 'amber' | 'stone' | 'emerald';

// Accent gradient mapping
export const ACCENT_GRADIENTS: Record<ThemeAccent, string> = {
  rose: 'from-rose-500 to-pink-500',
  amber: 'from-amber-500 to-orange-500',
  stone: 'from-stone-700 to-stone-900',
  emerald: 'from-emerald-500 to-teal-500',
} as const;

// Component Props
export interface LandingPageProps {
  locale?: Locale;
}

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
}

export interface ThemeCardProps {
  title: string;
  image: string;
  accent: ThemeAccent;
  features: readonly string[];
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  className?: string;
}

export interface NavbarProps {
  locale: Locale;
  translations: TranslationKeys;
  scrolled: boolean;
  onStartBuilding?: () => void;
}

export interface FooterProps {
  locale: Locale;
  translations: TranslationKeys;
}

export interface HeroSectionProps {
  translations: TranslationKeys;
  onStartBuilding: () => void;
}

export interface FeaturesSectionProps {
  translations: TranslationKeys;
}

export interface HowItWorksSectionProps {
  translations: TranslationKeys;
  onStartBuilding: () => void;
}

export interface ThemesSectionProps {
  translations: TranslationKeys;
}

export interface PricingSectionProps {
  translations: TranslationKeys;
  onStartBuilding: () => void;
}
