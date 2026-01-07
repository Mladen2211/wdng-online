'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { locales } from '@/lib/i18n/config';
import { Logo } from './Logo';
import type { NavbarProps } from './types';

export const Navbar: React.FC<NavbarProps> = ({ 
  locale, 
  translations: t, 
  scrolled, 
  onStartBuilding 
}) => {
  const router = useRouter();

  const handleStartBuilding = () => {
    if (onStartBuilding) {
      onStartBuilding();
    } else {
      router.push(`/${locale}/builder`);
    }
  };

  return (
  <nav
    className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-stone-100 py-4'
        : 'bg-transparent py-6'
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <Link href={`/${locale}`} className="flex items-center group">
        <Logo size="md" />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
        <Link href={`/${locale}/#features`} className="hover:text-stone-900 transition-colors">
          {t.nav.features}
        </Link>
        <Link href={`/${locale}/#themes`} className="hover:text-stone-900 transition-colors">
          {t.landing.themes?.title || 'Themes'}
        </Link>

        {/* Language Selector */}
        <div className="flex items-center gap-1 border-l border-stone-200 pl-4">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={`/${loc}`}
              className={`px-2 py-1 text-xs uppercase rounded ${
                loc === locale ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'
              }`}
            >
              {loc}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-stone-600 hover:text-stone-900 px-4 py-2 text-sm font-medium transition-colors">
              {t.nav.signIn}
            </button>
          </SignInButton>
        </SignedOut>
        <button
          onClick={handleStartBuilding}
          className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          {t.nav.getStarted} <ArrowRight size={16} />
        </button>
        <SignedIn>
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Link
                label="Dashboard"
                labelIcon={<LayoutDashboard size={16} />}
                href={`/${locale}/dashboard`}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
