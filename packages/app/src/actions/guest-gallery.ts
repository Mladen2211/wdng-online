'use server';

import { clerkClient } from "@clerk/nextjs/server";

export interface GalleryPhoto {
  id: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
  width?: number;
  height?: number;
}

export interface GalleryResult {
  success: boolean;
  photos: GalleryPhoto[];
  nextPageToken?: string;
  error?: string;
}

/**
 * Get Google OAuth token for a specific user (the album owner)
 */
async function getTokenForUser(clerkUserId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(clerkUserId, "google");
    return response.data[0]?.token || null;
  } catch (error) {
    console.error("Failed to get token for user:", error);
    return null;
  }
}

/**
 * Fetch photos from a Google Photos album
 * Uses the album owner's credentials to access the album
 * 
 * @param albumId - The Google Photos album ID
 * @param ownerClerkId - The Clerk user ID of the album owner
 * @param pageToken - Optional pagination token
 * @param pageSize - Number of photos to fetch (max 100)
 */
export async function getWeddingGallery(
  albumId: string,
  ownerClerkId: string,
  pageToken?: string,
  pageSize: number = 50
): Promise<GalleryResult> {
  const token = await getTokenForUser(ownerClerkId);
  
  if (!token) {
    return { 
      success: false, 
      photos: [],
      error: "Unable to load gallery. Please try again later." 
    };
  }

  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        albumId: albumId,
        pageSize: Math.min(pageSize, 100),
        ...(pageToken && { pageToken })
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch gallery:", errorText);
      return { success: false, photos: [], error: "Failed to load photos" };
    }

    const data = await response.json();
    
    const photos: GalleryPhoto[] = (data.mediaItems || []).map((item: {
      id: string;
      baseUrl: string;
      mimeType: string;
      filename: string;
      mediaMetadata?: {
        width?: string;
        height?: string;
      };
    }) => ({
      id: item.id,
      baseUrl: item.baseUrl,
      mimeType: item.mimeType,
      filename: item.filename,
      width: item.mediaMetadata?.width ? parseInt(item.mediaMetadata.width) : undefined,
      height: item.mediaMetadata?.height ? parseInt(item.mediaMetadata.height) : undefined
    }));

    return {
      success: true,
      photos,
      nextPageToken: data.nextPageToken
    };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return { success: false, photos: [], error: "An unexpected error occurred" };
  }
}
