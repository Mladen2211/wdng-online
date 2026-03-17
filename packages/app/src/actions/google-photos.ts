'use server';

import { auth } from "@clerk/nextjs/server";
import { getGoogleToken, hasAppendOnly } from "@/lib/google-photos-auth";

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

// Token retrieval + scope helpers live in @/lib/google-photos-auth

/**
 * Create a new wedding album in Google Photos
 * This creates the album, shares it, and returns the shareable URL
 */
export async function createWeddingAlbum(albumTitle: string): Promise<CreateAlbumResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in to create an album." };
  }

  const authResult = await getGoogleToken(userId);
  if (!authResult.token) {
    return { success: false, error: authResult.error || "No Google connection." };
  }

  if (!hasAppendOnly(authResult.scopes)) {
    return {
      success: false,
      error:
        "Missing Google Photos permission: photoslibrary.appendonly. " +
        "Please reconnect your Google account after the scopes have been updated in Clerk and Google Cloud.",
    };
  }

  const token = authResult.token;

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
          error: "Permission denied. Ensure the photoslibrary.appendonly scope is configured in Clerk Dashboard → Social Connections → Google, then reconnect your Google account." 
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
