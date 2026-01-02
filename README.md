# wdng monorepo - Wedding Website SaaS Platform

A Next.js-based SaaS platform that allows couples to build, preview, and publish wedding websites on custom subdomains.

## Architecture

This is a monorepo containing three packages:

- **@wdng/app**: Next.js frontend application
- **@wdng/api**: Express.js API server with authentication
- **@wdng/db**: Database package with migrations and seeds

## Features

- **Marketing Site**: Beautiful landing page at the root domain
- **Builder App**: Split-screen editor for creating wedding websites
- **User Sites**: Generated wedding websites on subdomains
- **Authentication**: Custom JWT-based auth with SQLite database
- **Multiple Themes**: Luxe Gold, Adriatic Blue, Vintage Sage
- **Multiple Layouts**: Immersive, The Arch, Vogue
- **Dynamic Sections**: Events timeline, photo gallery, FAQ, rich text
- **Real-time Preview**: See changes instantly
- **Responsive Design**: Mobile-first approach

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with bcrypt password hashing
- **Icons**: Lucide React
- **Fonts**: Geist Sans, Crimson Text (serif)

## Project Structure

```
/wdng-monorepo
├── packages/
│   ├── app/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # Next.js app router
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # Utilities and types
│   ├── api/                 # Express.js API server
│   │   ├── src/
│   │   └── .env
│   └── db/                  # Database package
│       └── src/
├── db/                      # Database files
└── package.json             # Monorepo root
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npm run db:migrate
   ```

3. **Configure environment variables**:
   - The API uses `packages/api/.env` (already configured for development)
   - Frontend doesn't need special configuration

4. **Start the services**:
   ```bash
   # Terminal 1: Start the API server
   npm run dev:api

   # Terminal 2: Start the frontend
   npm run dev
   ```

5. **Open your browser** and visit:
   - `http://localhost:3000` - Marketing site (root)
   - `http://localhost:3000/builder` - Builder app (requires login)
   - `http://localhost:3000/sites/sara-mladen` - Example wedding site

## Authentication

The platform uses custom JWT-based authentication:

- **Signup/Login**: Available on the landing page
- **Test Account**: `test@example.com` / `password123` (created by migration script)
- **Session Management**: HTTP-only cookies with JWT tokens
- **Password Security**: bcrypt hashing

## Database

- **In-Memory Storage**: Data stored in memory (resets on restart)
- **Production**: Replace with PostgreSQL/MySQL for persistence
- **Tables**: `users` and `sites` (in-memory arrays)
- **Migrations**: Run automatically on API startup

## Development Workflow

1. **Frontend Changes**: Work in `packages/app/`
2. **API Changes**: Work in `packages/api/`
3. **Database Changes**: Work in `packages/db/`
4. **Cross-package Changes**: Update imports accordingly

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login to existing account
- `POST /auth/logout` - Logout and clear session

### Sites
- `GET /me/site` - Load user's builder data
- `POST /me/site` - Save user's builder data
- `GET /public/site?host={subdomain}` - Load public wedding site

## Deployment

### Development
```bash
npm run dev      # Start frontend
npm run dev:api  # Start API server
```

### Production
```bash
npm run build      # Build frontend
npm run build:api  # Build API
npm run start      # Start frontend
npm run start:api  # Start API server
```

## Deployment

### Development
```bash
npm run dev      # Start frontend
npm run dev:api  # Start API server
```

### Production
```bash
npm run build      # Build frontend
npm run build:api  # Build API
npm run start      # Start frontend
npm run start:api  # Start API server
```

### Database
For production, replace the in-memory database with a persistent solution:
- PostgreSQL with Prisma
- MySQL with TypeORM
- MongoDB with Mongoose
- Update `packages/api/src/index.ts` and `packages/db/src/db.ts`
