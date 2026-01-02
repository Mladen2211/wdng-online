// In-memory database for demo purposes
// In production, replace with proper database like PostgreSQL, MySQL, etc.

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
}

// In-memory storage (data will be lost on restart)
export const users: User[] = [];
export const sites: Site[] = [];
export let nextUserId = 1;
export let nextSiteId = 1;

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
    return user;
  },

  findUserByEmail: (email: string) => {
    return users.find(u => u.email === email);
  },

  // Site operations
  createSite: (userId: number, configJson: string, subdomain?: string) => {
    const site = {
      id: nextSiteId++,
      user_id: userId,
      subdomain: subdomain || null,
      config_json: configJson,
      is_published: 0,
      updated_at: new Date().toISOString()
    };
    sites.push(site);
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
      return sites[existingIndex];
    }
    return null;
  },

  findSiteByUserId: (userId: number) => {
    return sites.find(s => s.user_id === userId);
  },

  findSiteBySubdomain: (subdomain: string) => {
    return sites.find(s => s.subdomain === subdomain);
  }
};

export default db;