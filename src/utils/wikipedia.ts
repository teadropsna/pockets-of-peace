import type { Lang } from '../types'

export interface WikiSummary {
  title: string
  description: string
  extract: string
  thumbnail?: { source: string; width: number; height: number }
  pageUrl: string
}

export async function fetchWikiSummary(
  name: string,
  lang: Lang
): Promise<WikiSummary | null> {
  const langCode = lang === 'ja' ? 'ja' : 'en'
  const encoded = encodeURIComponent(name)
  const url = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encoded}`

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) {
      // 日本語で見つからなければ英語にフォールバック
      if (lang === 'ja') return fetchWikiSummary(name, 'en')
      return null
    }
    const data = await res.json()
    // disambiguation や missing は除外
    if (data.type === 'disambiguation' || !data.extract) return null

    return {
      title: data.title,
      description: data.description ?? '',
      extract: data.extract,
      thumbnail: data.thumbnail,
      pageUrl: data.content_urls?.desktop?.page ?? '',
    }
  } catch {
    return null
  }
}
