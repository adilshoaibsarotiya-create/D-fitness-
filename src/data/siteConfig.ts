import { SiteSettings } from '../types';
import { sanitizeMapsEmbedUrl, DEFAULT_GODDA_MAPS_EMBED_URL } from '../lib/mapUtils';

const getEnv = (key: string, fallback: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

export const defaultSiteConfig: SiteSettings = {
  brandName: 'D FITNESS',
  tagline: 'CARDIO | STRENGTH | WEIGHT LOSS',
  locationCity: 'Godda',
  locationState: 'Jharkhand, India',
  phone: getEnv('VITE_PHONE_NUMBER', '+91 91424 13009'),
  whatsapp: getEnv('VITE_WHATSAPP_NUMBER', '919142413009'),
  email: 'info@dfitnessgodda.com',
  address: getEnv('VITE_GYM_ADDRESS', 'Gangta Rd, Fasia Dangal, Godda, Jharkhand 814133'),
  mapsUrl: getEnv('VITE_GOOGLE_MAPS_URL', 'https://maps.app.goo.gl/XEF7T2Sowxi9qSrt5'),
  mapsEmbedUrl: sanitizeMapsEmbedUrl(getEnv('VITE_GOOGLE_MAPS_EMBED_URL', DEFAULT_GODDA_MAPS_EMBED_URL)),
  instagram: 'https://instagram.com/dfitness_godda',
  facebook: 'https://facebook.com/dfitnessgodda',
  openingHoursWeekday: '05:30 AM – 10:00 PM (Monday – Saturday)',
  openingHoursWeekend: '06:00 AM – 01:00 PM (Sunday)',
  heroHeadline: 'BUILD YOUR STRONGEST SELF',
  heroSubheadline: "Godda's Premium Fitness Destination",
};

