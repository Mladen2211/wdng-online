import Link from 'next/link';
import { Logo } from './Logo';
import type { FooterProps } from './types';

export const Footer: React.FC<FooterProps> = ({ locale, translations: t }) => (
  <footer className="bg-stone-50 py-16 px-6 border-t border-stone-200">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <Link href={`/${locale}`} className="flex items-center group">
        <Logo size="sm" />
      </Link>
      <div className="flex gap-8 text-sm text-stone-500">
        <a href="#themes" className="hover:text-stone-900">
          {t.landing.footer?.templates || 'Templates'}
        </a>
        <a href="#" className="hover:text-stone-900">
          {t.landing.footer?.support || 'Support'}
        </a>
        <a href="#" className="hover:text-stone-900">
          {t.landing.footer?.login || 'Login'}
        </a>
      </div>
      <p className="text-stone-400 text-xs">
        {t.landing.footer?.copyright || '© 2026 wdng online Inc.'}
      </p>
    </div>
  </footer>
);

export default Footer;
