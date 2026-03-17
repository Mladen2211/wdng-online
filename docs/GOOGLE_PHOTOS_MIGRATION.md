# Google Photos migration (migrated notes)

This document consolidates the migration guidance previously stored in `google_photos_migration_notes.md`.

Goal
----
Stop assuming broad `photoslibrary` access and require only the exact Google Photos scopes the app needs:

- `https://www.googleapis.com/auth/photoslibrary.appendonly` (required for uploads)
- `https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata` (required for reading app-created media)

Optional (only if necessary):

- `https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata`

Key changes
-----------
1. Replace any loose scope checks (e.g. `s.includes('photoslibrary')`) with explicit scope checks.
2. Centralize Google token + scopes retrieval and expose helpers that validate required scopes.
3. Update user-facing error messages to name the actual missing scope (so owners know to reconnect).
4. Require previously connected users to reconnect after you change the scopes in Google Cloud / Clerk.

Suggested helper (example)
--------------------------
Create or move to a shared helper (e.g. `packages/app/src/lib/google-photos-auth.ts`):

```ts
export const PHOTOS_APPENDONLY =
  "https://www.googleapis.com/auth/photoslibrary.appendonly";
export const PHOTOS_READONLY_APP_CREATED =
  "https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata";
export const PHOTOS_EDIT_APP_CREATED =
  "https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata";

type GoogleAuthResult = {
  token: string | null;
  scopes: string[];
  error?: string;
};

async function getGoogleToken(userId: string): Promise<GoogleAuthResult> {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(userId, "google");

    if (!response.data || response.data.length === 0) {
      return {
        token: null,
        scopes: [],
        error: "No Google account connected. Please connect your Google account.",
      };
    }

    const tokenData = response.data[0];

    if (!tokenData?.token) {
      return {
        token: null,
        scopes: [],
        error: "Google token not available. Please reconnect your Google account.",
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

function hasAppendOnly(scopes: string[]) {
  return scopes.includes(PHOTOS_APPENDONLY);
}

function hasReadonlyAppCreated(scopes: string[]) {
  return scopes.includes(PHOTOS_READONLY_APP_CREATED);
}
```

Where to apply guards
---------------------
- `packages/app/src/actions/google-photos.ts`
  - Replace any `s.includes('photoslibrary')` checks with explicit `hasAppendOnly(...)` / `hasReadonlyAppCreated(...)` checks.
  - Use explicit error messages telling the owner to reconnect with the exact required scope.

- `packages/app/src/actions/guest-upload.ts`
  - Before uploading to `POST /v1/uploads` or `POST /v1/mediaItems:batchCreate`, ensure the owner token includes `PHOTOS_APPENDONLY`.

- `packages/app/src/actions/guest-gallery.ts`
  - Before reading album media, ensure the owner token includes `PHOTOS_READONLY_APP_CREATED`.

Error messages
--------------
Use explicit, actionable messages, e.g.:

- "Missing Google Photos permission: photoslibrary.appendonly. Reconnect Google after updating Clerk and Google Cloud scopes."
- "Missing Google Photos permission: photoslibrary.readonly.appcreateddata. Reconnect Google after updating scopes."

Checklist
---------
- [ ] Remove all old broad `photoslibrary*` assumptions from code.
- [ ] Add `getGoogleToken()` and scope-check helpers to a shared location.
- [ ] Guard album creation / uploads with `PHOTOS_APPENDONLY`.
- [ ] Guard gallery reads with `PHOTOS_READONLY_APP_CREATED`.
- [ ] Update user-facing errors to name the missing scope.
- [ ] Update Clerk and Google Cloud OAuth scopes and request owners reconnect.
- [ ] Test end-to-end with a freshly connected Google account and with an older token (verify reconnect flow).

Patch order recommendation
-------------------------
1. Fix `google-photos.ts` (central token + scope helper).
2. Reuse helper in `guest-upload.ts` to validate uploads.
3. Add read-scope check in `guest-gallery.ts`.
4. Update error text and UI guidance for reconnect.
5. Run E2E tests and manual checks with a newly connected account.

Notes
-----
- Do not request full `photoslibrary` scope; only request the minimal scopes required by the app.
- If you *must* allow editing app-created items, add `photoslibrary.edit.appcreateddata` explicitly and gate features behind it.

(Migrated from root `google_photos_migration_notes.md`)
