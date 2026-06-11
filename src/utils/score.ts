export function calcScore(tags: Record<string, string>): number {
  let score = 0
  if (tags.amenity === 'bench') score += 2
  if (tags.leisure === 'park' || tags.leisure === 'garden') score += 2
  if (tags.landuse === 'grass' || tags.natural === 'wood' || tags.natural === 'tree') score += 1
  if (tags.leisure === 'garden') score += 1
  if (!tags.highway) score += 1
  return Math.min(score, 7)
}

export const QUIET_MARKER = {
  fillColor: '#5a9e60',
  borderColor: '#fff',
  radius: 10,
  fillOpacity: 1,
  weight: 2.5,
}
