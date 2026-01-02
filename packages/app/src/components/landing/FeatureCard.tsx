import type { FeatureCardProps } from './types';

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-lg transition-all group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-stone-800 mb-3">{title}</h3>
    <p className="text-stone-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default FeatureCard;
