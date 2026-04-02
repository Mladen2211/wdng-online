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
          <p className="mb-4">Last Updated: April 2, 2026</p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">1. Information We Collect</h2>
          <p className="text-stone-600 mb-4">
            We collect information you provide directly to us when you create an account, build a wedding site, or contact us. This may include:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li><strong>Account Information:</strong> Name, email address, and authentication data provided via Clerk.</li>
            <li><strong>Wedding Details:</strong> Names of the couple, event dates, locations, and other details you choose to display on your site.</li>
            <li><strong>User Content:</strong> Photos and images you upload to the gallery or site assets.</li>
            <li><strong>Google User Data:</strong> If you connect your Google account, we access your Google Photos library as described in Section&nbsp;3 below. We do not access any other Google data (e.g. Gmail, Drive, Contacts).</li>
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

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">3. Google User Data &mdash; Access, Use, Sharing &amp; Disclosure</h2>
          <p className="text-stone-600 mb-4">
            When you connect your Google account to wdng.online, we request only the minimum Google API scopes necessary for the features you use:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li><code>photoslibrary.appendonly</code> &mdash; allows the app to create albums and upload photos on your behalf (used for guest photo uploads).</li>
            <li><code>photoslibrary.readonly.appcreateddata</code> &mdash; allows the app to read only the albums and photos that were created through wdng.online (used to display your wedding gallery).</li>
          </ul>

          <h3 className="text-lg font-bold text-stone-800 mt-4 mb-2">How We Use Google User Data</h3>
          <p className="text-stone-600 mb-4">
            Google user data is used exclusively to:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li>Create Google Photos albums for your wedding events.</li>
            <li>Upload guest photos to your Google Photos albums.</li>
            <li>Display photos from albums created through wdng.online on your wedding website.</li>
          </ul>

          <h3 className="text-lg font-bold text-stone-800 mt-4 mb-2">Sharing, Transfer &amp; Disclosure of Google User Data</h3>
          <p className="text-stone-600 mb-4">
            <strong>We do not sell, rent, share, transfer, or disclose your Google user data to any third parties.</strong> The following describes how we handle Google user data with respect to every category of potential recipient:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li><strong>Advertisers &amp; marketing partners:</strong> We never share Google user data with advertisers, ad networks, or marketing partners.</li>
            <li><strong>Data brokers &amp; analytics providers:</strong> We never sell, license, or provide Google user data to data brokers or analytics services.</li>
            <li><strong>Other users or the public:</strong> Google user data is not made publicly available. Photos displayed on your wedding site are served directly from Google&rsquo;s servers via your authorization; they do not pass through or get stored on our infrastructure.</li>
            <li><strong>Affiliated companies or subsidiaries:</strong> We have no affiliated entities. Your Google user data is not transferred to any parent company, subsidiary, or affiliated organization.</li>
            <li><strong>Sub-processors &amp; hosting providers:</strong> Our hosting infrastructure does not store or have access to your Google user data. API calls to Google Photos are made directly from our server using your encrypted OAuth token solely to fulfill your request, and no Google content is persisted on our servers.</li>
            <li><strong>Law enforcement or government agencies:</strong> We would only disclose Google user data if legally compelled by a valid court order, subpoena, or other binding legal process. We have never received such a request to date.</li>
          </ul>
          <p className="text-stone-600 mb-4">
            Additionally:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
            <li>Your Google OAuth access token is used only at the moment of the request to communicate directly with the Google Photos API and is not stored on our servers.</li>
            <li>Photos uploaded by guests via the app are added directly to your Google Photos album; they are not stored or cached on our servers.</li>
            <li>We do not use Google user data for advertising, profiling, or any purpose unrelated to the core features described above.</li>
          </ul>

          <h3 className="text-lg font-bold text-stone-800 mt-4 mb-2">Data Retention &amp; Deletion</h3>
          <p className="text-stone-600 mb-4">
            We do not persistently store any Google Photos content. All photos exist solely in your Google Photos account. If you disconnect your Google account or delete your wdng.online account, we immediately lose access to your Google data. You may also revoke access at any time via your{' '}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">Google Account permissions</a>.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">4. Third-Party Services</h2>
          <p className="text-stone-600 mb-4">
            We use trusted third-party service providers to help us operate the Service. These processors include:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
             <li><strong>Clerk:</strong> For secure user authentication and identity management. Clerk processes your email and profile data. <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">Clerk Privacy Policy</a>.</li>
             <li><strong>Google Photos API:</strong> For creating albums and uploading/displaying photos. Data flows directly between your browser and Google&rsquo;s servers using your OAuth token. We do not share or transfer your Google data to any other party. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">Google Privacy Policy</a>.</li>
             <li><strong>Mapbox / OpenStreetMap:</strong> For displaying maps and location data on your wedding site.</li>
             <li><strong>Hosting Provider:</strong> For server infrastructure and database hosting. The hosting provider does not have access to your Google user data.</li>
          </ul>
          <p className="text-stone-600 mb-4">
            <strong>None of the third-party service providers listed above receive, store, or have access to your Google user data</strong>, except for Google&rsquo;s own Photos API which processes data under your direct authorization. We do not share your personal information or Google user data with any parties other than as described in Section&nbsp;3 above.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">5. Data Security</h2>
          <p className="text-stone-600 mb-4">
            We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. All communication with Google APIs is encrypted via HTTPS. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">6. Your Rights</h2>
          <p className="text-stone-600 mb-4">
            You may update or delete your account information at any time by logging into your dashboard or contacting us. You may also request a copy of the personal data we hold about you. To revoke Google access specifically, visit your{' '}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">Google Account permissions page</a>.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">7. Contact Us</h2>
          <p className="text-stone-600 mb-4">
            If you have questions about this Privacy Policy or how we handle your Google user data, please contact us at privacy@wdng.online.
          </p>
        </div>
      </div>
      <Footer locale={locale} translations={t} />
    </div>
  );
}
