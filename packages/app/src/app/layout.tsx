import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import { generateSEOMetadata, viewport as seoViewport } from "@/lib/seo";
import { Toaster } from "sonner";
import "./globals.css";

// Force dynamic rendering at the root level to handle Clerk during build
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = generateSEOMetadata();
export const viewport: Viewport = seoViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Cookie Consent Manager Stylesheet */}
          <link rel="stylesheet" href="/silktide-consent-manager.css" />
          {/* Performance: Preconnect to critical third-party domains */}
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          {/* Consent mode defaults — must run before any GTM/GA scripts */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','functionality_storage':'denied','personalization_storage':'denied','security_storage':'granted','wait_for_update':500});`,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased font-sans`}
        >
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MWLS2NF3"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Toaster position="top-center" />
          <StructuredData />
          {/* Google Tag Manager */}
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MWLS2NF3');`}
          </Script>
          {/* Google Analytics (gtag.js) */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-CNFNPN9Y5H"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CNFNPN9Y5H');
            `}
          </Script>
          <CookieConsent />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
