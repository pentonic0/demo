export function hasImageSrc(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getSafeImageSrc(value: unknown, fallback = '/placeholder-image.svg') {
  return hasImageSrc(value) ? value.trim() : fallback;
}
