/**
 * Google Photos URL utilities
 */

/**
 * Get a URL for displaying a photo at a specific size
 * Google Photos requires size parameters to be appended to the baseUrl
 */
export function getPhotoUrl(
  baseUrl: string, 
  width: number = 400, 
  height: number = 400, 
  crop: boolean = true
): string {
  // Google Photos URL parameters:
  // =wWIDTH-hHEIGHT-c (crop to fit)
  // =wWIDTH-hHEIGHT (scale to fit)
  const cropParam = crop ? '-c' : '';
  return `${baseUrl}=w${width}-h${height}${cropParam}`;
}
