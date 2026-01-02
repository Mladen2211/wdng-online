'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

export interface GoogleAlbum {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: number;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
}

/**
 * Fetch the user's Google Photos albums
 * Requires the user to have connected their Google account with the photoslibrary scope
 */
export async function getAlbums(): Promise<GoogleAlbum[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    // Get the Google Access Token for the current user
    // Use 'google' without the oauth_ prefix (deprecated)
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(
      userId,
      "google"
    );

    const token = response.data[0]?.token;

    if (!token) {
      console.log("No Google token found. User might not have granted permissions.");
      return [];
    }

    // Fetch Albums from Google Photos API
    // pageSize=50 ensures we get a decent number of albums to choose from
    const res = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=50', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error("Google API Error:", await res.text());
      return [];
    }

    const data = await res.json();
    // Google returns an object { albums: [...] }
    return data.albums || [];
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}

/**
 * Save the selected album ID to the user's wedding site configuration
 * Note: Currently this just validates the request - actual persistence happens in the site data
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveAlbumId(albumId: string, albumTitle: string): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Album info is stored in the wedding site configuration on the client
  // This function can be extended for database persistence later
  return { success: true };
}

/**
 * Check if the user has connected their Google account
 */
export async function hasGoogleConnection(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(
      userId,
      "google"
    );
    return response.data.length > 0;
  } catch {
    return false;
  }
}
