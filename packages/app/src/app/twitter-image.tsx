import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'wdng.online - Create Your Dream Wedding Website';
export const size = {
  width: 1200,
  height: 600,
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
            top: 30,
            left: 30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            right: 60,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)',
            opacity: 0.5,
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.02em',
            }}
          >
            wdng
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: '#78716c',
              marginLeft: 6,
            }}
          >
            .online
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#44403c',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Create Your Dream Wedding Website
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 20,
            color: '#78716c',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Beautiful themes • Custom subdomains • Free to start
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
