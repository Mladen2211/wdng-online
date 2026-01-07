import { Navbar } from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { getTranslations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={locale} translations={t} scrolled={true} />
      <div className="pt-20 max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-serif text-stone-800 mb-8">Terms of Service</h1>
        <div className="prose prose-stone">
          <p className="mb-4">Last Updated: January 6, 2026</p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="text-stone-600 mb-4">
            By accessing or using wdng.online ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">2. Description of Service</h2>
          <p className="text-stone-600 mb-4">
            wdng.online provides a platform for couples to create, host, and share wedding websites. The Service currently offers:
          </p>
          <ul className="list-disc pl-5 text-stone-600 mb-4">
              <li>Customizable wedding website templates.</li>
              <li>Hosting of event details, timelines, and FAQs.</li>
              <li>Google Photos integration for guest galleries.</li>
              <li>RSVP management tools.</li>
          </ul>
          <p className="text-stone-600 mb-4">
             The Service is currently provided free of charge ("Free Usage Period"). We reserve the right to introduce premium paid features in the future, but existing free sites will remain accessible under the terms they were created.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">3. User Responsibilities</h2>
          <p className="text-stone-600 mb-4">
            You are responsible for all content you upload to the Service, including text, images, and links. You agree not to upload content that is illegal, offensive, or violates the rights of others.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">4. Disclaimer of Warranties</h2>
          <p className="text-stone-600 mb-4">
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">5. Limitation of Liability</h2>
          <p className="text-stone-600 mb-4">
            To the fullest extent permitted by law, wdng.online shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.
          </p>

          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">6. Changes to Terms</h2>
          <p className="text-stone-600 mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes. establishing a new wedding site after changes constitutes acceptance.
          </p>
          
          <h2 className="text-xl font-bold text-stone-800 mt-6 mb-3">7. Contact</h2>
          <p className="text-stone-600 mb-4">
            If you have any questions about these Terms, please contact us at support@wdng.online.
          </p>
        </div>
      </div>
      <Footer locale={locale} translations={t} />
    </div>
  );
}
