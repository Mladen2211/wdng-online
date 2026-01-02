import type { PricingSectionProps } from './types';

const PRICE = '€19.99';
const DEFAULT_TAGLINE = `One-time payment of ${PRICE} • All features included`;

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  translations: t, 
  onStartBuilding 
}) => (
  <section className="py-32 px-6 bg-white text-center" id="pricing">
    <div className="max-w-3xl mx-auto">
      {/* Price Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-amber-100 rounded-full mb-8">
        <span className="text-2xl font-bold text-stone-900">{PRICE}</span>
        <span className="text-stone-600">one-time</span>
      </div>

      <h2 className="font-serif text-5xl text-stone-900 mb-6">
        {t.landing.cta.title}
      </h2>
      
      <p className="text-lg text-stone-500 mb-10">
        {t.landing.cta.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onStartBuilding}
          className="px-10 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-xl"
        >
          {t.landing.cta.button}
        </button>
      </div>

      <p className="mt-6 text-xs text-stone-400 uppercase tracking-widest">
        {t.landing.pricing?.tagline || DEFAULT_TAGLINE}
      </p>
    </div>
  </section>
);

export default PricingSection;
