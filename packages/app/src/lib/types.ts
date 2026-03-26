// TypeScript interfaces for the wedding website data

export type ThemeId = 'gold' | 'blue' | 'sage' | 'rose';
export type LayoutId = 'immersive' | 'arch' | 'vogue';
export type SectionType = 'events' | 'photos' | 'faq' | 'text' | 'rsvp';

export interface GoogleAlbumConfig {
  albumId: string;
  albumTitle: string;
}

export interface WeddingConfig {
  selectedTheme: ThemeId;
  selectedLayout: LayoutId;
  targetDate: string;
  siteLocale?: 'en' | 'de' | 'hr';
  googleAlbum?: GoogleAlbumConfig;
}

export interface WeddingGlobal {
  bride: string;
  groom: string;
  initials: string;
  dateFull: string;
  dateTime: string;
  locationCity: string;
  locationCountry: string;
  heroTitle: string;
  heroImage: string;
  heroImagePosition?: string; // e.g. 'center', 'top', 'bottom', 'left', 'right'
  navLabels: string[];
  footerLinks: string[];
  copyright?: string; // Deprecated — footer now auto-generates from bride/groom/city
  // Optional customizable labels for countdown and hero
  daysLabel?: string;        // Default: "Days"
  hoursLabel?: string;       // Default: "Hrs"  
  minutesLabel?: string;     // Default: "Min"
  secondsLabel?: string;     // Default: "Sec"
  heroTagline?: string;      // Default: "The Wedding" (for vogue layout)
  // Couple contact info (shown in footer)
  contactEmail?: string;
  contactPhone?: string;
  contactInstagram?: string;
}

export interface WeddingData {
  config: WeddingConfig;
  global: WeddingGlobal;
  sections: Section[];
}

// Event-specific types
export interface EventItem {
  id: number;
  title: string;
  time: string;
  location: string;
  description?: string;
  iconType: string;
  coordinates?: { lat: number; lng: number };
  albumId?: string;
}

export interface EventsData {
  title: string;
  subtitle?: string;
  items: EventItem[];
}

export interface PhotosData {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  image: string;
  albumId?: string;
  albumUrl?: string;
  // Optional labels for customization - if not set, default English will be used in preview
  galleryLabel?: string;           // Default: "Gallery"
  viewAlbumLabel?: string;         // Default: "View Album" 
  openInPhotosLabel?: string;      // Default: "Open in Google Photos"
  comingSoonTitle?: string;        // Default: "Photo Sharing Coming Soon"
  comingSoonSubtitle?: string;     // Default: "The couple is setting up their photo album."
  uploadTitle?: string;            // Default: "Share Your Photos"
  uploadSubtitle?: string;         // Default: "Upload your photos from the wedding"
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqData {
  title: string;
  items: FaqItem[];
}

export interface TextData {
  title: string;
  subtitle?: string;
}

export interface RsvpData {
  title: string;
  subtitle?: string;
  deadline?: string;
  fields: RsvpField[];
  // Translatable labels for the RSVP form display
  respondByLabel?: string;    // Default: "Please respond by"
  submitLabel?: string;       // Default: "Send RSVP"
  selectOptionLabel?: string; // Default: "Select an option"
  enterYourLabel?: string;    // Default: "Enter your"
}

export interface RsvpField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // For select fields
}

export type SectionData = EventsData | PhotosData | FaqData | TextData | RsvpData;

export interface Section {
  id: string;
  type: SectionType;
  name?: string; // Custom name for navigation
  data: SectionData;
}

export interface WeddingSite {
  id: string;
  subdomain: string;
  ownerEmail: string;
  configJson: WeddingData;
  isPublished: boolean;
  plan: 'free' | 'premium';
  weddingDate: Date;
  createdAt: Date;
  expiresAt: Date;
}

export interface ThemeColors {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentLight: string;
  border: string;
  gradientText: string;
  button: string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  colors: ThemeColors;
}

export interface Layout {
  id: LayoutId;
  label: string;
  description: string;
}