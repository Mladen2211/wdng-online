import Link from 'next/link';
import { Instagram, Mail, Heart } from 'lucide-react';
import { Logo } from './Logo';
import type { FooterProps } from './types';

export const Footer: React.FC<FooterProps> = ({ locale, translations: t }) => (
  <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-12 border-b border-stone-800">
        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href={`/${locale}`} className="flex items-center group">
            <Logo size="sm" />
            <span className="ml-3 font-serif text-xl text-white">wdng.online</span>
          </Link>
          <p className="text-stone-400 text-sm leading-relaxed">
            Beautiful wedding websites, effortlessly created. Share your love story with the world.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link href={`/${locale}/legal/impressum`} className="hover:text-white transition-colors">
                Impressum
              </Link>
              <Link href={`https://wdng.online/${locale}/terms/privacy`} className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/legal/terms`} className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://instagram.com/wdng.online"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram size={16} />
                @wdng.online
              </a>
              <a
                href="mailto:wdng.online@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} />
                wdng.online@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
        <p className="text-stone-400 text-xs">
          {t.landing.footer?.copyright || '© 2026 wdng online Inc. All rights reserved.'}
        </p>
        <p className="text-stone-400 text-xs flex items-center gap-1">
          Made with <Heart size={12} className="text-rose-400 fill-rose-400" /> for couples everywhere
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
