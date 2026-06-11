import type { OsmElement, Spot } from '../types'
import { calcScore } from './score'

export async function fetchSpots(lat: number, lng: number): Promise<Spot[]> {
  const r = 500
  const query = `[out:json][timeout:15];
(
  node["amenity"="bench"](around:${r},${lat},${lng});
  node["leisure"="park"](around:${r},${lat},${lng});
  node["leisure"="garden"](around:${r},${lat},${lng});
  way["leisure"="park"](around:${r},${lat},${lng});
  way["leisure"="garden"](around:${r},${lat},${lng});
  way["landuse"="grass"](around:${r},${lat},${lng});
  node["natural"="tree"](around:${r},${lat},${lng});
);
out center;`

  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)
  const res = await fetch(url)
  if (!res.ok) throw new Error('Overpass API error')
  const data: { elements: OsmElement[] } = await res.json()

  return data.elements.flatMap((el) => {
    const lat = el.lat ?? el.center?.lat
    const lng = el.lon ?? el.center?.lon
    if (lat == null || lng == null) return []

    const tags = el.tags ?? {}
    const score = calcScore(tags)
    if (score < 4) return []

    const name = tags.name ?? tags['name:en'] ?? tags['name:ja'] ?? ''

    return [{ id: el.id, lat, lng, name, score, tags }]
  })
}
