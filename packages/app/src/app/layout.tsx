import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import { generateSEOMetadata, viewport as seoViewport } from "@/lib/seo";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
          <link rel="stylesheet" href="/silktide-consent-manager.css" />
          {/* Performance: Preconnect to critical third-party domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://images.unsplash.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased font-sans`}
        >
          <Toaster position="top-center" />
          <StructuredData />
          <Script id="consent-mode-defaults" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `}
          </Script>
          <CookieConsent />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
