export const sanitizeHref = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch {
    // Invalid URL format
  }

  return undefined;
};
