import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export const metadata: Metadata = {
  title: "wdng online - Design Your Dream Wedding Website",
  description: "Professional hosting, personalized subdomains, and editorial-grade themes. Build a beautiful experience for your guests in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
