import type { FeatureCardProps } from './types';

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-lg hover:border-stone-200 hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-lg sm:text-xl text-stone-800 mb-2 sm:mb-3">{title}</h3>
    <p className="text-stone-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default FeatureCard;
