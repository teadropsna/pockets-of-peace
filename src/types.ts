import type { WikiSummary } from './utils/wikipedia'

export type Lang = 'en' | 'ja'

export interface OsmElement {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

export interface Spot {
  id: number
  lat: number
  lng: number
  name: string
  score: number
  tags: Record<string, string>
  wiki: WikiSummary & { thumbnail: NonNullable<WikiSummary['thumbnail']> }
}
