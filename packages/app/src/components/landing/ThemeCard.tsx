import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { ThemeCardProps } from './types';
import { ACCENT_GRADIENTS } from './types';

export const ThemeCard: React.FC<ThemeCardProps> = ({ title, image, accent, features }) => (
  <div className="group cursor-pointer">
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="aspect-[3/4] relative overflow-hidden">
        <Image
          src={image}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          alt={title}
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
          <div
            className={`w-10 h-1 bg-gradient-to-r ${ACCENT_GRADIENTS[accent]} rounded-full mb-2 sm:mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
          />
          <h3 className="text-white text-lg sm:text-2xl font-serif font-bold mb-1 sm:mb-2">{title}</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {features.map((feature, i) => (
              <span
                key={i}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-white/80 bg-white/10 backdrop-blur-sm rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <ArrowRight size={16} className="text-stone-900 sm:hidden" />
          <ArrowRight size={18} className="text-stone-900 hidden sm:block" />
        </div>
      </div>
    </div>
  </div>
);

export default ThemeCard;
