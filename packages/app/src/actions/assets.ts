'use server';

import { auth } from '@clerk/nextjs/server';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an asset (image) and persist it to disk
 * Returns the public URL for the uploaded asset
 */
export async function uploadAsset(formData: FormData): Promise<UploadResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 20MB.' };
    }

    ensureUploadsDir();

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${userId}_${generateId()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading asset:', error);
    return { success: false, error: 'Failed to upload asset' };
  }
}

/**
 * Delete an uploaded asset
 */
export async function deleteAsset(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Extract filename from URL
    const filename = url.replace('/uploads/', '');
    
    // Verify the file belongs to the user (filename starts with userId)
    if (!filename.startsWith(userId)) {
      return { success: false, error: 'Unauthorized to delete this asset' };
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting asset:', error);
    return { success: false, error: 'Failed to delete asset' };
  }
}
