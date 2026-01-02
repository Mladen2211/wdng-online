'use server';

import { clerkClient } from "@clerk/nextjs/server";

interface UploadResult {
  success: boolean;
  mediaItemId?: string;
  error?: string;
}

/**
 * Get Google OAuth token for a specific user (the album owner)
 * This is used to upload photos on behalf of guests using the couple's credentials
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
 * Upload a photo to Google Photos album
 * This uploads using the album owner's credentials (not the guest's)
 * 
 * @param fileBytes - The raw bytes of the image file
 * @param fileName - The original filename
 * @param albumId - The Google Photos album ID
 * @param ownerClerkId - The Clerk user ID of the album owner
 */
export async function uploadPhoto(
  fileBytes: ArrayBuffer,
  fileName: string,
  albumId: string,
  ownerClerkId: string
): Promise<UploadResult> {
  // Get the album owner's Google token
  const token = await getTokenForUser(ownerClerkId);
  
  if (!token) {
    return { 
      success: false, 
      error: "Unable to authenticate with Google Photos. The album owner may need to reconnect their account." 
    };
  }

  try {
    // Step 1: Upload raw bytes to get an upload token
    const uploadRes = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-Content-Type': getMimeType(fileName),
        'X-Goog-Upload-Protocol': 'raw'
      },
      body: fileBytes
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Upload failed:", errorText);
      return { success: false, error: "Failed to upload photo" };
    }

    const uploadToken = await uploadRes.text();

    // Step 2: Create media item in the album using the upload token
    const createRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        albumId: albumId,
        newMediaItems: [{
          description: `Uploaded by wedding guest`,
          simpleMediaItem: {
            fileName: fileName,
            uploadToken: uploadToken
          }
        }]
      })
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error("Create media item failed:", errorText);
      return { success: false, error: "Failed to add photo to album" };
    }

    const createData = await createRes.json();
    const newMediaItem = createData.newMediaItemResults?.[0];

    if (newMediaItem?.status?.code && newMediaItem.status.code !== 0) {
      return { 
        success: false, 
        error: newMediaItem.status.message || "Failed to create media item" 
      };
    }

    return {
      success: true,
      mediaItemId: newMediaItem?.mediaItem?.id
    };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Upload multiple photos at once
 * Handles the batch upload more efficiently
 */
export async function uploadPhotos(
  files: { bytes: ArrayBuffer; name: string }[],
  albumId: string,
  ownerClerkId: string
): Promise<{ success: boolean; uploaded: number; failed: number; errors: string[] }> {
  const results = {
    success: true,
    uploaded: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Upload each file (Google's batch API is limited, so we do them one at a time)
  for (const file of files) {
    const result = await uploadPhoto(file.bytes, file.name, albumId, ownerClerkId);
    
    if (result.success) {
      results.uploaded++;
    } else {
      results.failed++;
      results.errors.push(result.error || 'Unknown error');
    }
  }

  results.success = results.failed === 0;
  return results;
}

/**
 * Get MIME type from filename
 */
function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'heic': 'image/heic',
    'heif': 'image/heif'
  };
  return mimeTypes[ext || ''] || 'image/jpeg';
}
