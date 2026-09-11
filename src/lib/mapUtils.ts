export const DEFAULT_GODDA_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115456.88371380757!2d87.14238712398403!3d24.831969245232502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f0f9b69123c8a9%3A0x7d0fa25e6ff95b95!2sGodda%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

/**
 * Extracts and sanitizes the embed source URL.
 * Automatically handles:
 * - Full HTML <iframe> embed snippets: <iframe src="https://www.google.com/maps/embed?..." ...></iframe>
 * - Direct Google Maps embed URLs: https://www.google.com/maps/embed?...
 * - Fallbacks to default Godda facility map if invalid or empty
 */
export function sanitizeMapsEmbedUrl(rawInput?: string): string {
  if (!rawInput || typeof rawInput !== 'string') {
    return DEFAULT_GODDA_MAPS_EMBED_URL;
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return DEFAULT_GODDA_MAPS_EMBED_URL;
  }

  // 1. Extract from <iframe ... src="..." ...>
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // 2. Direct HTTP/HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return DEFAULT_GODDA_MAPS_EMBED_URL;
}
