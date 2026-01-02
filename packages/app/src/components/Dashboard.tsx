'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Copy, Check, X, Share2 } from 'lucide-react';
import { getUserSites, toggleSitePublished, deleteSiteAction } from '@/actions/dashboard';
import { useTranslations, useLocale } from '@/lib/i18n/useTranslations';
import type { Site } from '@wdng/db/src/db';
import type { WeddingData } from '@/lib/types';

interface DashboardProps {
  locale?: string;
}

export default function Dashboard({ locale: propLocale }: DashboardProps) {
  const { isSignedIn, isLoaded } = useUser();
  const t = useTranslations();
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;
  
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [qrModalSubdomain, setQrModalSubdomain] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSignedIn) {
      loadSites();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  async function loadSites() {
    setLoading(true);
    try {
      const userSites = await getUserSites();
      setSites(userSites);
    } catch (error) {
      console.error('Failed to load sites:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublished(siteId: number) {
    setActionLoading(siteId);
    try {
      const result = await toggleSitePublished(siteId);
      if (result.success) {
        setSites(sites.map(site => 
          site.id === siteId 
            ? { ...site, is_published: site.is_published === 1 ? 0 : 1 }
            : site
        ));
      }
    } catch (error) {
      console.error('Failed to toggle site:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(siteId: number) {
    if (!confirm(t.dashboard.confirmDelete)) return;
    
    setActionLoading(siteId);
    try {
      const result = await deleteSiteAction(siteId);
      if (result.success) {
        setSites(sites.filter(site => site.id !== siteId));
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    } finally {
      setActionLoading(null);
    }
  }

  function getSiteData(site: Site): WeddingData | null {
    try {
      return JSON.parse(site.config_json);
    } catch {
      return null;
    }
  }

  function getSiteUrl(subdomain: string) {
    const prodUrl = `https://${subdomain}.wdng.online`;
    const devUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/sites/${subdomain}`
      : `/sites/${subdomain}`;
    return process.env.NODE_ENV === 'production' ? prodUrl : devUrl;
  }

  const handleCopyLink = async (subdomain: string) => {
    try {
      await navigator.clipboard.writeText(getSiteUrl(subdomain));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = (subdomain: string) => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1024;
    const padding = 64;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size);
      const link = document.createElement('a');
      link.download = `${subdomain}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async (subdomain: string) => {
    const url = getSiteUrl(subdomain);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Site',
          text: 'Scan this QR code to view our wedding website!',
          url,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink(subdomain);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-300 border-t-rose-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-serif text-gray-800 mb-4">{t.dashboard.title}</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your wedding sites.</p>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium">
              {t.nav.signIn}
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <Image src="/logo.png" alt="wdng online" width={44} height={44} className="rounded-xl relative shadow-lg group-hover:scale-105 transition-transform" />
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href={`/${locale}/builder`}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              {t.dashboard.createNew}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800">{t.dashboard.title}</h1>
          <p className="text-gray-600 mt-2">{t.dashboard.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-300 border-t-rose-600" />
          </div>
        ) : sites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💒</div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">{t.dashboard.noSites}</h2>
            <p className="text-gray-600 mb-6">{t.dashboard.noSitesAction}</p>
            <Link 
              href={`/${locale}/builder`}
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              {t.dashboard.createNew}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map(site => {
              const data = getSiteData(site);
              const isLoading = actionLoading === site.id;
              
              return (
                <div 
                  key={site.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Preview Image */}
                  <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center relative">
                    {data?.global.heroImage ? (
                      <Image 
                        src={data.global.heroImage} 
                        alt="Site preview" 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-4xl">💍</div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        site.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {site.is_published ? t.dashboard.site.published : t.dashboard.site.draft}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-lg text-gray-800 mb-1">
                      {data?.global.bride || 'Bride'} & {data?.global.groom || 'Groom'}
                    </h3>
                    
                    {site.subdomain && (
                      <p className="text-sm text-gray-500 mb-3">
                        {site.subdomain}.wdng.online
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mb-4">
                      {t.dashboard.site.lastUpdated}: {new Date(site.updated_at).toLocaleDateString()}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/${locale}/builder?edit=${site.id}`}
                        className="flex-1 px-3 py-2 text-sm text-center bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        {t.dashboard.site.edit}
                      </Link>
                      
                      {site.subdomain && (
                        <>
                          <Link
                            href={`/sites/${site.subdomain}`}
                            target="_blank"
                            className="flex-1 px-3 py-2 text-sm text-center bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {t.dashboard.site.preview}
                          </Link>
                          <button
                            onClick={() => setQrModalSubdomain(site.subdomain)}
                            className="px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
                            title="QR Code"
                          >
                            <QrCode size={16} />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleTogglePublished(site.id)}
                        disabled={isLoading}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          site.is_published 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {site.is_published ? t.dashboard.site.unpublish : t.dashboard.site.publish}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(site.id)}
                        disabled={isLoading}
                        className={`px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {t.dashboard.site.delete}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {qrModalSubdomain && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setQrModalSubdomain(null)}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">Share Your Site</h2>
              <p className="text-stone-500 text-sm mt-1">
                Guests can scan this QR code to view your wedding website
              </p>
            </div>

            {/* QR Code */}
            <div 
              ref={qrRef}
              className="bg-white p-6 rounded-xl border-2 border-stone-100 flex items-center justify-center mb-6"
            >
              <QRCodeSVG 
                value={getSiteUrl(qrModalSubdomain)}
                size={200}
                level="H"
                includeMargin={false}
                bgColor="white"
                fgColor="#1c1917"
              />
            </div>

            {/* URL Display */}
            <div className="bg-stone-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-stone-500 mb-1">Website URL</p>
              <p className="text-sm text-stone-700 font-medium break-all">{getSiteUrl(qrModalSubdomain)}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCopyLink(qrModalSubdomain)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-stone-600" />
                )}
                <span className="text-xs text-stone-600">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>

              <button
                onClick={() => handleDownloadQR(qrModalSubdomain)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Download className="w-5 h-5 text-stone-600" />
                <span className="text-xs text-stone-600">Download</span>
              </button>

              <button
                onClick={() => handleShare(qrModalSubdomain)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-stone-600" />
                <span className="text-xs text-stone-600">Share</span>
              </button>
            </div>

            {/* Print tip */}
            <div className="mt-6 pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-400 text-center">
                💡 Tip: Download the QR code to print on your wedding invitations
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
