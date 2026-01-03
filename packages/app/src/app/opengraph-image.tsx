import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'wdng.online - Create Your Dream Wedding Website';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAF9',
          backgroundImage: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 50%, #E7E5E4 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 120,
            right: 120,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)',
            opacity: 0.5,
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.02em',
            }}
          >
            wdng
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 300,
              color: '#78716c',
              marginLeft: 8,
            }}
          >
            .online
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#44403c',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Create Your Dream Wedding Website
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#78716c',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Beautiful themes • Custom subdomains • Photo galleries • Interactive maps
        </div>

        {/* CTA Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
            padding: '16px 32px',
            backgroundColor: '#1c1917',
            borderRadius: 50,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            Free to Start • No Coding Required
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
