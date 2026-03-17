'use client';

import React, { useState, useEffect } from 'react';
import WeddingPreview, { SiteInfo } from '@/components/WeddingPreview';
import { LoadingSpinner } from '@/components/ui';
import { WeddingData } from '@/lib/types';
import { getSiteBySubdomain } from '@/actions/sites';
import Link from 'next/link';

// Mock data for demonstration - fallback when no saved sites exist
const MOCK_SITE_DATA: Record<string, WeddingData> = {
  'emma-liam': {
    config: {
      selectedTheme: 'gold',
      selectedLayout: 'immersive',
      targetDate: 'May 10, 2026 16:00:00',
    },
    global: {
      bride: 'Emma',
      groom: 'Liam',
      initials: 'E & L',
      dateFull: '10. Svibnja 2026.',
      dateTime: '16:00',
      locationCity: 'Zagreb',
      locationCountry: 'Croatia',
      heroTitle: 'Rezervirajte Datum',
      heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
      navLabels: ['Detalji', 'Info', 'Slike'],
      footerLinks: ['Instagram', 'Email', 'Karta'],
      copyright: '© 2026 Emma & Liam • Zagreb'
    },
    sections: [
      {
        id: 'sec_1',
        type: 'events',
        data: {
          title: 'Vikend',
          subtitle: 'Pridružite nam se u proslavi ljubavi.',
          items: [
            { id: 1, title: 'Obred Vjenčanja', time: '16:00 H', location: 'Crkva Sv. Marka', description: 'Gornji Grad', iconType: 'clock' },
            { id: 2, title: 'Svadbena Večera', time: '18:00 H', location: 'Hotel Esplanade', description: 'Smaragdna dvorana', iconType: 'music' }
          ]
        }
      },
      {
        id: 'sec_2',
        type: 'photos',
        data: {
          title: 'Vaše fotografije, <br/>naša sjećanja.',
          subtitle: 'Pomozite nam prikupiti sve trenutke s vjenčanja.',
          buttonLabel: 'Google Photos Album',
          image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2000&auto=format&fit=crop'
        }
      },
      {
        id: 'sec_3',
        type: 'faq',
        data: {
          title: 'Česta Pitanja',
          items: [
            { q: "Što odjenuti?", a: "Svečana odjeća." },
            { q: "Jesu li djeca pozvana?", a: "Događaj samo za odrasle." }
          ]
        }
      }
    ]
  }
};

interface WeddingSiteProps {
  siteId: string;
}

const WeddingSite: React.FC<WeddingSiteProps> = ({ siteId }) => {
  const [data, setData] = useState<WeddingData | null>(null);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch site data using server action
    const fetchSiteData = async () => {
      try {
        const result = await getSiteBySubdomain(siteId);
        
        if (result.success && result.data) {
          setData(result.data);
          setSiteInfo({
            siteId,
            ownerClerkId: result.ownerClerkId || undefined
          });
        } else {
          // Do NOT fall back to demo couple data on public pages.
          // In development we may still allow using mock demo data for convenience.
          if (process.env.NODE_ENV === 'development') {
            const mockSiteData = MOCK_SITE_DATA[siteId];
            if (mockSiteData) {
              setData(mockSiteData);
              setSiteInfo({ siteId });
            } else {
              setError('Site not found');
            }
          } else {
            setError('Site not found');
          }
        }
      } catch {
        // On error, avoid showing demo couple data in production.
        if (process.env.NODE_ENV === 'development') {
          const mockSiteData = MOCK_SITE_DATA[siteId];
          if (mockSiteData) {
            setData(mockSiteData);
            setSiteInfo({ siteId });
          } else {
            setError('Failed to load site');
          }
        } else {
          setError('Failed to load site');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading wedding site..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💔</span>
          </div>
          <h1 className="text-2xl font-serif text-stone-800 mb-4">Site Not Found</h1>
          <p className="text-stone-600 mb-6">The wedding website you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return <WeddingPreview data={data} siteInfo={siteInfo || undefined} />;
};

export default WeddingSite;