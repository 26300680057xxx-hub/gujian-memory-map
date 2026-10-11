/** Public URLs normally resolve to the site; the standalone sample embeds them. */
export function publicAsset(path: string): string {
  const embedded = (window as Window & { __gujianAssets?: Record<string, string> }).__gujianAssets
  return embedded?.[path] ?? `${import.meta.env.BASE_URL}${path}`
}
