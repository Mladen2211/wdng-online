# wdng.online

Wedding website builder — create, preview, and publish wedding websites on custom subdomains.

Live at [wdng.online](https://wdng.online)

## Features

- Visual split-screen builder with real-time preview
- Custom subdomains (`yourname.wdng.online`)
- Multiple themes (Luxe Gold, Adriatic Blue, Vintage Sage) and layouts (Immersive, The Arch, Vogue)
- Events timeline, photo gallery, FAQ, RSVP, rich text sections
- Guest photo uploads & Google Photos integration
- QR code generation for sharing
- Internationalization (EN / DE / HR)
- SEO with per-site meta tags and JSON-LD structured data
- Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, standalone output)
- **Auth**: Clerk
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL
- **Icons**: Lucide React
- **Fonts**: Geist Sans, Crimson Text

## Project Structure

```
packages/
  app/     # Next.js frontend (landing, builder, dashboard, wedding sites)
  db/      # File-based JSON persistence
  api/     # API server (unused — server actions handle everything)
```

## Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
APP_BASE_URL=https://wdng.online
```

## Production Deployment

Dockerized with nginx reverse proxy and Cloudflare Tunnel.

```bash
docker compose build app
docker compose up -d
```

### Services

| Service | Description |
|---------|-------------|
| **nginx** | Reverse proxy, serves uploads, static asset caching |
| **app** | Next.js standalone server |
| **db** | PostgreSQL + PostGIS |
| **tunnel** | Cloudflare Tunnel for public access |

### Persistent Volumes

| Host Path | Container Path | Purpose |
|-----------|---------------|---------|
| `./uploads` | `/app/packages/app/public/uploads` | User-uploaded images |
| `./app-data` | `/app/packages/app/data` | Site data (JSON) |
| `./data` | `/var/lib/postgresql/data` | PostgreSQL data |
