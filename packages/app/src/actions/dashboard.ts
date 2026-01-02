'use server';

import db, { type Site } from '@wdng/db/src/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getUserSites(): Promise<Site[]> {
  const { userId } = await auth();
  
  if (!userId) {
    return [];
  }
  
  return db.getSitesByClerkUserId(userId);
}

export async function toggleSitePublished(siteId: number): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const site = db.findSiteById(siteId);
  
  if (!site) {
    return { success: false, error: 'Site not found' };
  }
  
  if (site.owner_clerk_id !== userId) {
    return { success: false, error: 'Not authorized' };
  }
  
  db.toggleSitePublished(siteId);
  revalidatePath('/dashboard');
  
  return { success: true };
}

export async function deleteSiteAction(siteId: number): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const site = db.findSiteById(siteId);
  
  if (!site) {
    return { success: false, error: 'Site not found' };
  }
  
  if (site.owner_clerk_id !== userId) {
    return { success: false, error: 'Not authorized' };
  }
  
  db.deleteSite(siteId);
  revalidatePath('/dashboard');
  
  return { success: true };
}
