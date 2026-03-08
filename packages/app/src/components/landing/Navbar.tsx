'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartBuilding = () => {
    setMobileMenuOpen(false);
    if (onStartBuilding) {
      onStartBuilding();
    } else {
      router.push(`/${locale}/builder`);
    }
  };

  return (
  <>
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-stone-100 py-3 sm:py-4'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="hidden sm:block text-stone-600 hover:text-stone-900 px-4 py-2 text-sm font-medium transition-colors">
                {t.nav.signIn}
              </button>
            </SignInButton>
          </SignedOut>
          <button
            onClick={handleStartBuilding}
            className="hidden sm:flex bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl items-center gap-2"
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile menu overlay */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-40 md:hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-in-right">
          <div className="pt-20 px-6 flex flex-col gap-6">
            <Link
              href={`/${locale}/#features`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-700 font-medium py-2 hover:text-stone-900 transition-colors"
            >
              {t.nav.features}
            </Link>
            <Link
              href={`/${locale}/#themes`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-700 font-medium py-2 hover:text-stone-900 transition-colors"
            >
              {t.landing.themes?.title || 'Themes'}
            </Link>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 py-2 border-t border-stone-100 pt-4">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-1.5 text-xs uppercase rounded-md ${
                    loc === locale ? 'bg-stone-900 text-white' : 'bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  {loc}
                </Link>
              ))}
            </div>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-stone-600 hover:text-stone-900 py-2 text-sm font-medium transition-colors text-left">
                  {t.nav.signIn}
                </button>
              </SignInButton>
            </SignedOut>

            <button
              onClick={handleStartBuilding}
              className="bg-stone-900 text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-stone-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {t.nav.getStarted} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;
