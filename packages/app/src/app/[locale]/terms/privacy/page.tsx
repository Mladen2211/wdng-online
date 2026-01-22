import { Navbar } from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { getTranslations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={locale} translations={t} scrolled={true} />
      <div className="pt-20 max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-serif text-stone-800 mb-8">Privacy Policy</h1>
        <div className="prose prose-stone">
          <p className="mb-4">Last Updated: January 6, 2026</p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">1. Information We Collect</h2>
          <p className="text-stone-600 mb-4">
            We collect information you provide directly to us when you create an account, build a wedding site, or contact us. This may include:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li><strong>Account Information:</strong> Name, email address, and authentication data provided via Clerk.</li>
            <li><strong>Wedding Details:</strong> Names of the couple, event dates, locations, and other details you choose to display on your site.</li>
            <li><strong>User Content:</strong> Photos and images you upload to the gallery or site assets.</li>
          </ul>

           <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="text-stone-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li>Provide, maintain, and improve the Service.</li>
            <li>Host and display your wedding website to your guests.</li>
            <li>Facilitate the upload and sharing of photos via Google Photos integration.</li>
            <li>Communicate with you about your account and the Service.</li>
          </ul>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">3. Third-Party Services</h2>
          <p className="text-stone-600 mb-4">
            We use trusted third-party service providers to help us operate the Service. These processors include:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
             <li><strong>Clerk:</strong> For secure user authentication and identity management.</li>
             <li><strong>Google Photos:</strong> For storing and managing photo albums (if you choose to connect your account).</li>
             <li><strong>Mapbox / OpenStreetMap:</strong> For displaying maps and location data.</li>
             <li><strong>Hosting Provider:</strong> For server infrastructure and database hosting.</li>
          </ul>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">4. Data Security</h2>
          <p className="text-stone-600 mb-4">
            We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">5. Your Rights</h2>
          <p className="text-stone-600 mb-4">
            You may update or delete your account information at any time by logging into your dashboard or contacting us. You may also request a copy of the personal data we hold about you.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">6. Contact Us</h2>
          <p className="text-stone-600 mb-4">
            If you have questions about this Privacy Policy, please contact us at privacy@wdng.online.
          </p>
        </div>
      </div>
      <Footer locale={locale} translations={t} />
    </div>
  );
}
