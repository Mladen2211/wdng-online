// In-memory database with file-based persistence for development
// In production, replace with proper database like PostgreSQL, MySQL, etc.

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');
const COUNTERS_FILE = path.join(DATA_DIR, 'counters.json');

export interface User {
  id: number;
  email: string;
  password: string;
  created_at: string;
}

export interface Site {
  id: number;
  user_id: number;
  subdomain: string | null;
  config_json: string;
  is_published: number;
  updated_at: string;
  // Google Photos Album fields
  google_album_id: string | null;
  public_album_url: string | null;
  owner_clerk_id: string | null;  // Clerk user ID for OAuth token retrieval
  is_paid?: boolean;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load data from file
function loadData<T>(filePath: string, defaultValue: T): T {
  try {
    ensureDataDir();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
  return defaultValue;
}

// Save data to file
function saveData<T>(filePath: string, data: T): void {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
  }
}

// Load initial data
const counters = loadData<{ nextUserId: number; nextSiteId: number }>(COUNTERS_FILE, { nextUserId: 1, nextSiteId: 1 });

// In-memory storage with persistence
export const users: User[] = loadData<User[]>(USERS_FILE, []);
export const sites: Site[] = loadData<Site[]>(SITES_FILE, []);
export let nextUserId = counters.nextUserId;
export let nextSiteId = counters.nextSiteId;

// Save counters
function saveCounters() {
  saveData(COUNTERS_FILE, { nextUserId, nextSiteId });
}

// Database operations
export const db = {
  // User operations
  createUser: (email: string, password: string) => {
    const user = {
      id: nextUserId++,
      email,
      password,
      created_at: new Date().toISOString()
    };
    users.push(user);
    saveData(USERS_FILE, users);
    saveCounters();
    return user;
  },

  findUserByEmail: (email: string) => {
    return users.find(u => u.email === email);
  },

  // Site operations
  createSite: (userId: number, configJson: string, subdomain?: string, clerkUserId?: string) => {
    const site: Site = {
      id: nextSiteId++,
      user_id: userId,
      subdomain: subdomain || null,
      config_json: configJson,
      is_published: 0,
      updated_at: new Date().toISOString(),
      google_album_id: null,
      public_album_url: null,
      owner_clerk_id: clerkUserId || null,
      is_paid: false
    };
    sites.push(site);
    saveData(SITES_FILE, sites);
    saveCounters();
    return site;
  },

  updateSite: (userId: number, configJson: string, subdomain?: string) => {
    const existingIndex = sites.findIndex(s => s.user_id === userId);
    if (existingIndex >= 0) {
      sites[existingIndex] = {
        ...sites[existingIndex],
        config_json: configJson,
        subdomain: subdomain || sites[existingIndex].subdomain,
        updated_at: new Date().toISOString()
      };
      saveData(SITES_FILE, sites);
      return sites[existingIndex];
    }
    return null;
  },

  updateSiteById: (siteId: number, configJson: string) => {
    const existingIndex = sites.findIndex(s => s.id === siteId);
    if (existingIndex >= 0) {
      sites[existingIndex] = {
        ...sites[existingIndex],
        config_json: configJson,
        updated_at: new Date().toISOString()
      };
      saveData(SITES_FILE, sites);
      return sites[existingIndex];
    }
    return null;
  },

  updateSiteAlbum: (userId: number, googleAlbumId: string, publicAlbumUrl: string) => {
    const existingIndex = sites.findIndex(s => s.user_id === userId);
    if (existingIndex >= 0) {
      sites[existingIndex] = {
        ...sites[existingIndex],
        google_album_id: googleAlbumId,
        public_album_url: publicAlbumUrl,
        updated_at: new Date().toISOString()
      };
      saveData(SITES_FILE, sites);
      return sites[existingIndex];
    }
    return null;
  },

  updateSitePayment: (siteId: number, isPaid: boolean) => {
    const existingIndex = sites.findIndex(s => s.id === siteId);
    if (existingIndex >= 0) {
      sites[existingIndex] = {
        ...sites[existingIndex],
        is_paid: isPaid,
        is_published: isPaid ? 1 : sites[existingIndex].is_published,
        updated_at: new Date().toISOString()
      };
      saveData(SITES_FILE, sites);
      return sites[existingIndex];
    }
    return null;
  },

  findSiteByUserId: (userId: number) => {
    return sites.find(s => s.user_id === userId);
  },

  findSiteBySubdomain: (subdomain: string) => {
    return sites.find(s => s.subdomain === subdomain);
  },

  getSitesByClerkUserId: (clerkUserId: string) => {
    return sites.filter(s => s.owner_clerk_id === clerkUserId);
  },

  findSiteById: (siteId: number) => {
    return sites.find(s => s.id === siteId);
  },

  toggleSitePublished: (siteId: number) => {
    const existingIndex = sites.findIndex(s => s.id === siteId);
    if (existingIndex >= 0) {
      sites[existingIndex] = {
        ...sites[existingIndex],
        is_published: sites[existingIndex].is_published === 1 ? 0 : 1,
        updated_at: new Date().toISOString()
      };
      saveData(SITES_FILE, sites);
      return sites[existingIndex];
    }
    return null;
  },

  deleteSite: (siteId: number) => {
    const existingIndex = sites.findIndex(s => s.id === siteId);
    if (existingIndex >= 0) {
      const deleted = sites.splice(existingIndex, 1);
      saveData(SITES_FILE, sites);
      return deleted[0];
    }
    return null;
  },

  // Force save all data (useful for updates done directly to arrays)
  persist: () => {
    saveData(USERS_FILE, users);
    saveData(SITES_FILE, sites);
    saveCounters();
  }
};

export default db;