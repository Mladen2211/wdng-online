import type { StepProps } from './types';

export const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex gap-6">
    <div className="font-serif text-3xl text-stone-500">{number}</div>
    <div>
      <h3 className="font-bold text-xl mb-1">{title}</h3>
      <p className="text-stone-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Step;
