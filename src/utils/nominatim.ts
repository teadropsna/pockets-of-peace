import type { Lang } from '../types'

export async function fetchPlaceName(lat: number, lng: number, lang: Lang): Promise<string | null> {
  const langCode = lang === 'ja' ? 'ja' : 'en'
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=${langCode}`

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()

    if (data.name) return data.name as string
    if (data.display_name) return (data.display_name as string).split(',')[0].trim()
    return null
  } catch {
    return null
  }
}
