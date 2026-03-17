import { clerkClient } from "@clerk/nextjs/server";

// ── Google Photos OAuth scope constants ──────────────────────────────────────
export const PHOTOS_APPENDONLY =
  "https://www.googleapis.com/auth/photoslibrary.appendonly";
export const PHOTOS_READONLY_APP_CREATED =
  "https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata";
export const PHOTOS_EDIT_APP_CREATED =
  "https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata";

// ── Types ────────────────────────────────────────────────────────────────────
export interface GoogleAuthResult {
  token: string | null;
  scopes: string[];
  error?: string;
}

// ── Token retrieval ──────────────────────────────────────────────────────────
/**
 * Fetch the Google OAuth access token **and scopes** for a Clerk user.
 * Does NOT validate any specific scope – callers decide which scope they need.
 */
export async function getGoogleToken(
  userId: string
): Promise<GoogleAuthResult> {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(
      userId,
      "google"
    );

    if (!response.data || response.data.length === 0) {
      return {
        token: null,
        scopes: [],
        error:
          "No Google account connected. Please connect your Google account in your profile settings.",
      };
    }

    const tokenData = response.data[0];

    if (!tokenData?.token) {
      return {
        token: null,
        scopes: [],
        error:
          "Google token not available. Please reconnect your Google account.",
      };
    }

    return {
      token: tokenData.token,
      scopes: tokenData.scopes || [],
    };
  } catch (err) {
    console.error("Error getting Google token:", err);
    return {
      token: null,
      scopes: [],
      error: "Failed to retrieve Google credentials.",
    };
  }
}

// ── Scope helpers ────────────────────────────────────────────────────────────
/** True when the token has the `photoslibrary.appendonly` scope (create albums / upload). */
export function hasAppendOnly(scopes: string[]): boolean {
  return scopes.includes(PHOTOS_APPENDONLY);
}

/** True when the token has the `photoslibrary.readonly.appcreateddata` scope (read gallery). */
export function hasReadonlyAppCreated(scopes: string[]): boolean {
  return scopes.includes(PHOTOS_READONLY_APP_CREATED);
}
