'use client';

import React, { useState, useEffect } from 'react';
import WeddingPreview from '@/components/WeddingPreview';
import { LoadingSpinner } from '@/components/ui';
import { WeddingData } from '@/lib/types';

// Mock data for demonstration - in production this would come from a database
const MOCK_SITE_DATA: Record<string, WeddingData> = {
  'sara-mladen': {
    config: {
      selectedTheme: 'gold',
      selectedLayout: 'immersive',
      targetDate: 'May 10, 2026 16:00:00',
    },
    global: {
      bride: 'Sara',
      groom: 'Mladen',
      initials: 'S & M',
      dateFull: '10. Svibnja 2026.',
      dateTime: '16:00',
      locationCity: 'Zagreb',
      locationCountry: 'Croatia',
      heroTitle: 'Rezervirajte Datum',
      heroImage: 'https://images.unsplash.com/photo-1519225468359-2996bc01c326?q=80&w=2000&auto=format&fit=crop',
      navLabels: ['Detalji', 'Info', 'Slike'],
      footerLinks: ['Instagram', 'Email', 'Karta'],
      copyright: '© 2026 Sara & Mladen • Zagreb'
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch site data from API
    const fetchSiteData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/public/site?host=${siteId}`);
        if (response.ok) {
          const siteData = await response.json();
          setData(siteData);
        } else {
          // Fallback to mock data if API fails
          const siteData = MOCK_SITE_DATA[siteId];
          if (siteData) {
            setData(siteData);
          } else {
            setError('Site not found');
          }
        }
      } catch (err) {
        // Fallback to mock data
        const siteData = MOCK_SITE_DATA[siteId];
        if (siteData) {
          setData(siteData);
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
          <p className="text-stone-600 mb-6">The wedding website you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return <WeddingPreview data={data} />;
};

export default WeddingSite;