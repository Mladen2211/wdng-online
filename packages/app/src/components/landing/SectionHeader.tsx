import type { SectionHeaderProps } from './types';

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  badge,
  className = '' 
}) => (
  <div className={`text-center mb-16 ${className}`}>
    {badge && (
      <span className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
        {badge}
      </span>
    )}
    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">{title}</h2>
    {subtitle && (
      <p className="text-stone-500 text-lg max-w-xl mx-auto">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;
