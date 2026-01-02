import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ==========================================
// 1. IN-MEMORY DATABASE (Demo purposes)
// ==========================================

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

interface Site {
  id: number;
  user_id: number;
  subdomain: string | null;
  config_json: string;
  is_published: number;
  updated_at: string;
}

const users: User[] = [];
const sites: Site[] = [];
let nextUserId = 1;
let nextSiteId = 1;
// ==========================================

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-123');
const ALG = 'HS256';

async function createSession(res: express.Response, userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

async function getSession(req: express.Request): Promise<{ userId: number } | null> {
  const token = req.cookies.session;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: [ALG] });
    return payload as { userId: number };
  } catch {
    return null;
  }
}

// ==========================================
// 3. EXPRESS APP SETUP
// ==========================================

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// ==========================================
// 4. ROUTES
// ==========================================

// --- POST /auth/signup ---
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = users.find(u => u.email === email);
    if (existing) return res.status(409).json({ error: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);
    const userId = nextUserId++;
    users.push({
      id: userId,
      name,
      email,
      password: hashed,
      created_at: new Date().toISOString()
    });

    await createSession(res, userId);
    return res.json({ success: true, user: { id: userId, name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// --- POST /auth/login ---
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    await createSession(res, user.id);
    return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// --- POST /auth/logout ---
app.post('/auth/logout', (req, res) => {
  res.clearCookie('session');
  return res.json({ success: true });
});

// --- GET /me (Get current user info) ---
app.get('/me', async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const user = users.find(u => u.id === session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// --- GET /me/site (Load User's Builder Data) ---
app.get('/me/site', async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const site = sites.find(s => s.user_id === session.userId);
    if (!site) return res.json({ data: null }); // No site yet
    return res.json({ data: JSON.parse(site.config_json), subdomain: site.subdomain });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Database error' });
  }
});

// --- POST /me/site (Save Builder Data) ---
app.post('/me/site', async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data, subdomain } = req.body;
    if (!data) return res.status(400).json({ error: 'No data' });

    const existingSiteIndex = sites.findIndex(s => s.user_id === session.userId);

    if (existingSiteIndex >= 0) {
      // Update existing site
      sites[existingSiteIndex] = {
        ...sites[existingSiteIndex],
        config_json: JSON.stringify(data),
        subdomain: subdomain || sites[existingSiteIndex].subdomain,
        updated_at: new Date().toISOString()
      };
    } else {
      // Create new site
      sites.push({
        id: nextSiteId++,
        user_id: session.userId,
        subdomain,
        config_json: JSON.stringify(data),
        is_published: 0,
        updated_at: new Date().toISOString()
      });
    }

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Save failed' });
  }
});

// --- GET /public/site (Load Public Website by Subdomain) ---
app.get('/public/site', (req, res) => {
  const host = req.query.host as string;
  if (!host) return res.status(400).json({ error: 'Subdomain required' });

  try {
    const site = sites.find(s => s.subdomain === host);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    return res.json(JSON.parse(site.config_json));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Error' });
  }
});

// ==========================================
// 5. START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});