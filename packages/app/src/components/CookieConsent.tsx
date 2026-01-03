"use client";

import Script from "next/script";

// Extend Window interface for silktide consent manager
declare global {
  interface Window {
    silktideConsentManager?: {
      init: (config: {
        consentTypes: Array<{
          id: string;
          label: string;
          description: string;
          defaultValue: boolean;
          gtag: string | string[];
          scripts?: Array<{
            url: string;
            load: string;
            type: string;
          }>;
          onAccept?: () => void;
        }>;
      }) => void;
    };
    dataLayer: unknown[];
  }
}

export default function CookieConsent() {
  return (
    <Script
      src="/silktide-consent-manager.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.silktideConsentManager) {
          window.silktideConsentManager.init({
            consentTypes: [
              {
                id: "analytics",
                label: "Analytics",
                description:
                  "These help us understand how visitors interact with the website.",
                defaultValue: true,
                gtag: "analytics_storage",
                scripts: [
                  {
                    url: "https://www.googletagmanager.com/gtag/js?id=G-ZVY8CL1MS5",
                    load: "async",
                    type: "text/javascript",
                  },
                ],
                onAccept: function () {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push(["js", new Date()]);
                  window.dataLayer.push(["config", "G-ZVY8CL1MS5"]);
                },
              },
              {
                id: "marketing",
                label: "Marketing",
                description:
                  "These are used to deliver personalized advertisements.",
                defaultValue: false,
                gtag: ["ad_storage", "ad_user_data", "ad_personalization"],
              },
            ],
          });
        }
      }}
    />
  );
}
