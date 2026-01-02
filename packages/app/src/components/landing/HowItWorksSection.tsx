import Image from 'next/image';
import { Step } from './Step';
import type { HowItWorksSectionProps } from './types';

// Step configuration for easy maintenance
const STEPS = ['step1', 'step2', 'step3'] as const;
const STEP_NUMBERS = ['01', '02', '03'] as const;

const STEP_DEFAULTS = {
  step1: { title: 'Choose your vibe', desc: 'Select a layout and theme that matches your wedding style.' },
  step2: { title: 'Add your details', desc: 'Fill in the date, location, and your story. Add events to the timeline.' },
  step3: { title: 'Publish & Share', desc: 'Hit save and instantly get a live link to send to your guests.' },
} as const;

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ 
  translations: t, 
  onStartBuilding 
}) => {
  const howItWorks = t.landing.howItWorks;

  return (
    <section className="py-24 px-6 bg-stone-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              {howItWorks?.title || 'Build in 3 simple steps.'}
            </h2>
            
            <div className="space-y-8">
              {STEPS.map((stepKey, index) => {
                const stepData = howItWorks?.[stepKey];
                const defaults = STEP_DEFAULTS[stepKey];
                
                return (
                  <Step
                    key={stepKey}
                    number={STEP_NUMBERS[index]}
                    title={stepData?.title || defaults.title}
                    description={stepData?.desc || defaults.desc}
                  />
                );
              })}
            </div>

            <button
              onClick={onStartBuilding}
              className="mt-10 px-8 py-3 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-100 transition-colors"
            >
              {howItWorks?.button || 'Start Designing Now'}
            </button>
          </div>

          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl blur-3xl opacity-20" />
            <div className="relative aspect-[4/3] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2000&auto=format&fit=crop"
                alt="Process"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
