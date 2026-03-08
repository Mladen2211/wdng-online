'use client';

import { useScrollAnimation } from './useScrollAnimation';
import type { PricingSectionProps } from './types';

const PRICE = 'Free';
const DEFAULT_TAGLINE = `Community Preview • All premium features included`;

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  translations: t, 
  onStartBuilding 
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 sm:py-32 px-6 bg-white text-center" id="pricing">
      <div
        className={`max-w-3xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        ref={ref}
      >
        <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-6">
          {t.landing.cta.title}
        </h2>
        
        <p className="text-lg text-stone-600 mb-10">
          Create your dream wedding website today. Free for everyone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onStartBuilding}
            className="px-10 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            {t.landing.cta.button}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
