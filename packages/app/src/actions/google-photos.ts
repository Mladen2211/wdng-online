'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

export interface GoogleAlbum {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: number;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
  shareableUrl?: string;
}

export interface CreateAlbumResult {
  success: boolean;
  albumId?: string;
  shareableUrl?: string;
  error?: string;
}

/**
 * Get Google OAuth token for the current user
 */
async function getGoogleToken(userId: string): Promise<{ token: string | null; error?: string }> {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(userId, "google");
    
    if (!response.data || response.data.length === 0) {
      return { token: null, error: "No Google account connected. Please connect your Google account in your profile settings." };
    }
    
    const tokenData = response.data[0];
    if (!tokenData?.token) {
      return { token: null, error: "Google token not available. Please reconnect your Google account." };
    }
    
    // Check if we have the required scopes
    const scopes = tokenData.scopes || [];
    const hasPhotosScope = scopes.some((s: string) => s.includes('photoslibrary'));
    
    if (!hasPhotosScope) {
      return { 
        token: null, 
        error: "Missing Google Photos permissions. Please ask the site admin to configure the photoslibrary scope in Clerk." 
      };
    }
    
    return { token: tokenData.token };
  } catch (err) {
    console.error("Error getting Google token:", err);
    return { token: null, error: "Failed to retrieve Google credentials." };
  }
}

/**
 * Create a new wedding album in Google Photos
 * This creates the album, shares it, and returns the shareable URL
 */
export async function createWeddingAlbum(albumTitle: string): Promise<CreateAlbumResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in to create an album." };
  }

  const { token, error: tokenError } = await getGoogleToken(userId);
  if (!token) {
    return { success: false, error: tokenError || "No Google connection." };
  }

  try {
    // Step 1: Create the album
    const createRes = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        album: { title: albumTitle }
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.json().catch(() => ({}));
      console.error("Failed to create album:", createRes.status, errorData);
      
      if (createRes.status === 403) {
        return { 
          success: false, 
          error: "Permission denied. The Google Photos scope needs to be configured in Clerk Dashboard → Social Connections → Google." 
        };
      }
      if (createRes.status === 401) {
        return { success: false, error: "Google token expired. Please reconnect your Google account." };
      }
      
      return { success: false, error: `Failed to create album: ${errorData.error?.message || 'Unknown error'}` };
    }

    const album = await createRes.json();
    const albumId = album.id;
    // Note: The sharing API (albums/:share) was deprecated on March 31, 2025.
    // We now use the productUrl which is the owner's private link to view the album.
    // This is not a public share link, but it's what we can use.
    const productUrl = album.productUrl;

    return {
      success: true,
      albumId,
      shareableUrl: productUrl  // Using productUrl as the album link
    };
  } catch (error) {
    console.error("Error creating album:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Check if the user has connected their Google account with Photos permissions
 */
export async function hasGoogleConnection(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const { token } = await getGoogleToken(userId);
  return token !== null;
}

/**
 * Get detailed connection status for debugging
 */
export async function getConnectionStatus(): Promise<{ connected: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { connected: false, error: "Not signed in" };

  const { token, error } = await getGoogleToken(userId);
  return { connected: token !== null, error };
}

/**
 * Get the current user's Clerk ID (for storing with site data)
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
