'use client';

import { Palette, Check, Camera, Smartphone, Globe, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { SectionHeader } from './SectionHeader';
import { useScrollAnimation } from './useScrollAnimation';
import type { FeaturesSectionProps } from './types';

// Feature configuration - makes it easy to add/remove features
const FEATURE_ICONS = {
  themes: <Palette className="text-rose-500" />,
  rsvp: <Check className="text-green-500" />,
  photos: <Camera className="text-orange-500" />,
  mobile: <Smartphone className="text-blue-500" />,
  subdomain: <Globe className="text-emerald-500" />,
  editor: <Zap className="text-amber-500" />,
} as const;

type FeatureKey = keyof typeof FEATURE_ICONS;

const FEATURE_ORDER: FeatureKey[] = ['themes', 'rsvp', 'photos', 'mobile', 'subdomain', 'editor'];

// Default fallback values for features that may not have translations
const FEATURE_DEFAULTS: Record<string, { title: string; description: string }> = {
  subdomain: {
    title: 'Personal Subdomain',
    description: 'Get a beautiful, custom URL like ana&luka.wdng.online included with your site.',
  },
  editor: {
    title: 'Real-time Editor',
    description: 'See your changes as you type. Our split-screen builder makes designing intuitive and fast.',
  },
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ translations: t }) => {
  const { ref, isVisible } = useScrollAnimation();

  const getFeatureData = (key: FeatureKey) => {
    const feature = t.landing.features[key as keyof typeof t.landing.features];
    const defaults = FEATURE_DEFAULTS[key];
    
    if (typeof feature === 'object' && feature !== null && 'title' in feature) {
      return {
        title: feature.title,
        description: feature.description,
      };
    }
    
    return defaults || { title: key, description: '' };
  };

  return (
    <section id="features" className="cv-auto py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionHeader
          title={t.landing.features.title}
          subtitle={t.landing.features.subtitle}
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {FEATURE_ORDER.map((key, index) => {
            const { title, description } = getFeatureData(key);
            return (
              <div
                key={key}
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  icon={FEATURE_ICONS[key]}
                  title={title}
                  description={description}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
