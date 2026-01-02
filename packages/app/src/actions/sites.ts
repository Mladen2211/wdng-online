'use server';

import { auth } from '@clerk/nextjs/server';
import { db, sites, Site } from '@wdng/db';
import { WeddingData } from '@/lib/types';

export interface SaveSiteResult {
  success: boolean;
  error?: string;
  siteId?: number;
}

export interface GetSiteResult {
  success: boolean;
  data?: WeddingData;
  subdomain?: string | null;
  siteId?: number;
  ownerClerkId?: string | null;
  isSubdomainLocked?: boolean;  // True if site has been saved before (subdomain cannot change)
  error?: string;
}

export interface SubdomainCheckResult {
  success: boolean;
  available?: boolean;
  error?: string;
}

export interface GetSitesResult {
  success: boolean;
  sites?: Array<{
    id: number;
    subdomain: string | null;
    is_published: number;
    updated_at: string;
    config_json: string;
  }>;
  error?: string;
}

/**
 * Check if a subdomain is available
 */
export async function checkSubdomainAvailable(subdomain: string): Promise<SubdomainCheckResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    if (!cleanSubdomain || cleanSubdomain.length < 3) {
      return { success: false, error: 'Subdomain must be at least 3 characters' };
    }

    const existingSite = db.findSiteBySubdomain(cleanSubdomain);
    
    // Available if no site exists OR if it belongs to the current user
    if (!existingSite) {
      return { success: true, available: true };
    }
    
    const isOwner = existingSite.owner_clerk_id === userId;
    return { success: true, available: isOwner };
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return { success: false, error: 'Failed to check subdomain' };
  }
}

/**
 * Save or update the user's wedding site
 */
export async function saveSite(data: WeddingData, subdomain: string): Promise<SaveSiteResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Check if user already has a site
    const existingSites = db.getSitesByClerkUserId(userId);
    
    if (existingSites.length > 0) {
      // Update existing site - subdomain is LOCKED, ignore any subdomain changes
      const site = existingSites[0];
      const existingIndex = sites.findIndex((s: Site) => s.id === site.id);
      if (existingIndex >= 0) {
        sites[existingIndex] = {
          ...sites[existingIndex],
          config_json: JSON.stringify(data),
          // Keep the original subdomain - it cannot be changed after first save
          updated_at: new Date().toISOString()
        };
        db.persist(); // Save to file
        return { success: true, siteId: site.id };
      }
    }

    // For new sites, check subdomain availability
    const existingSiteWithSubdomain = db.findSiteBySubdomain(cleanSubdomain);
    if (existingSiteWithSubdomain) {
      return { success: false, error: 'This subdomain is already taken. Please choose a different one.' };
    }

    // Create new site with the subdomain
    const newSite = db.createSite(0, JSON.stringify(data), cleanSubdomain, userId);
    
    return { success: true, siteId: newSite.id };
  } catch (error) {
    console.error('Error saving site:', error);
    return { success: false, error: 'Failed to save site' };
  }
}

/**
 * Get the current user's site
 */
export async function getUserSite(): Promise<GetSiteResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const userSites = db.getSitesByClerkUserId(userId);
    
    if (userSites.length === 0) {
      return { success: true, data: undefined };
    }

    const site = userSites[0];
    return {
      success: true,
      data: JSON.parse(site.config_json),
      subdomain: site.subdomain,
      siteId: site.id,
      isSubdomainLocked: true  // Site exists, subdomain is locked
    };
  } catch (error) {
    console.error('Error getting site:', error);
    return { success: false, error: 'Failed to get site' };
  }
}

/**
 * Get all sites for the current user
 */
export async function getUserSites(): Promise<GetSitesResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const userSites = db.getSitesByClerkUserId(userId);
    
    return {
      success: true,
      sites: userSites.map((s: Site) => ({
        id: s.id,
        subdomain: s.subdomain,
        is_published: s.is_published,
        updated_at: s.updated_at,
        config_json: s.config_json
      }))
    };
  } catch (error) {
    console.error('Error getting sites:', error);
    return { success: false, error: 'Failed to get sites' };
  }
}

/**
 * Get a site by its ID (for public viewing)
 */
export async function getSiteById(siteId: number): Promise<GetSiteResult> {
  try {
    const site = db.findSiteById(siteId);
    
    if (!site) {
      return { success: false, error: 'Site not found' };
    }

    return {
      success: true,
      data: JSON.parse(site.config_json),
      subdomain: site.subdomain,
      siteId: site.id,
      ownerClerkId: site.owner_clerk_id
    };
  } catch (error) {
    console.error('Error getting site by ID:', error);
    return { success: false, error: 'Failed to get site' };
  }
}

/**
 * Get a site by subdomain (for public viewing)
 */
export async function getSiteBySubdomain(subdomain: string): Promise<GetSiteResult> {
  try {
    const site = db.findSiteBySubdomain(subdomain);
    
    if (!site) {
      return { success: false, error: 'Site not found' };
    }

    return {
      success: true,
      data: JSON.parse(site.config_json),
      subdomain: site.subdomain,
      siteId: site.id,
      ownerClerkId: site.owner_clerk_id
    };
  } catch (error) {
    console.error('Error getting site by subdomain:', error);
    return { success: false, error: 'Failed to get site' };
  }
}
/**
 * Delete a site
 */
export async function deleteSite(siteId: number): Promise<SaveSiteResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const site = db.findSiteById(siteId);
    if (!site || site.owner_clerk_id !== userId) {
      return { success: false, error: 'Site not found or unauthorized' };
    }

    db.deleteSite(siteId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting site:', error);
    return { success: false, error: 'Failed to delete site' };
  }
}

/**
 * Toggle site published status
 */
export async function togglePublished(siteId: number): Promise<SaveSiteResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const site = db.findSiteById(siteId);
    if (!site || site.owner_clerk_id !== userId) {
      return { success: false, error: 'Site not found or unauthorized' };
    }

    db.toggleSitePublished(siteId);
    return { success: true, siteId };
  } catch (error) {
    console.error('Error toggling published status:', error);
    return { success: false, error: 'Failed to update site' };
  }
}
