import { useState, useEffect } from 'react'
import type { Spot, Lang } from '../types'
import { getPlaceInfo } from '../utils/placeLabel'
import { fetchWikiSummary, type WikiSummary } from '../utils/wikipedia'
import { fetchPlaceName } from '../utils/nominatim'

interface Props {
  spot: Spot
  lang: Lang
}

type Status = 'idle' | 'loading' | 'done' | 'fallback'

export default function SpotPopup({ spot, lang }: Props) {
  const [wiki, setWiki] = useState<WikiSummary | null>(null)
  const [placeName, setPlaceName] = useState<string | null>(spot.name || null)
  const [status, setStatus] = useState<Status>('idle')
  const place = getPlaceInfo(spot.tags)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    async function load() {
      let name = spot.name

      if (!name) {
        const found = await fetchPlaceName(spot.lat, spot.lng, lang)
        if (cancelled) return
        if (found) {
          name = found
          setPlaceName(found)
        }
      }

      if (name) {
        const result = await fetchWikiSummary(name, lang)
        if (cancelled) return
        setWiki(result)
        setStatus(result ? 'done' : 'fallback')
      } else {
        setStatus('fallback')
      }
    }

    load()
    return () => { cancelled = true }
  }, [spot.name, spot.lat, spot.lng, lang])

  return (
    <div style={{ width: '220px', fontFamily: 'Georgia, serif' }}>

      {/* 写真エリア */}
      {status === 'loading' && (
        <div style={photoPlaceholderStyle}>
          <span style={{ color: '#bbb', fontSize: '0.75rem' }}>読み込み中…</span>
        </div>
      )}
      {status === 'done' && wiki?.thumbnail && (
        <div style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden' }}>
          <img
            src={wiki.thumbnail.source}
            alt={wiki.title}
            style={{ width: '100%', maxHeight: '130px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* 場所の種別バッジ */}
      <div style={{ fontSize: '0.72rem', color: '#7BAE7F', fontWeight: 'bold', marginBottom: '2px' }}>
        {place.emoji} {place.label[lang]}
      </div>

      {/* 固有名 */}
      {(status === 'done' && wiki?.title) ? (
        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
          {wiki.title}
        </div>
      ) : placeName ? (
        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
          {placeName}
        </div>
      ) : null}

      {/* Wikipedia の短い説明（description = サブタイトル的な一行） */}
      {status === 'done' && wiki?.description && (
        <div style={{ fontSize: '0.72rem', color: '#999', marginBottom: '4px' }}>
          {wiki.description}
        </div>
      )}

      {/* 本文抜粋 or フォールバック説明 */}
      <div style={{ fontSize: '0.82rem', color: '#5a5050', lineHeight: '1.55' }}>
        {status === 'done' && wiki?.extract
          ? truncate(wiki.extract, 120)
          : status !== 'loading'
          ? place.desc[lang]
          : null}
      </div>

      {/* Wikipedia へのリンク */}
      {status === 'done' && wiki?.pageUrl && (
        <a
          href={wiki.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', marginTop: '8px', fontSize: '0.72rem', color: '#7BAE7F' }}
        >
          Wikipedia で詳しく →
        </a>
      )}
    </div>
  )
}

const photoPlaceholderStyle: React.CSSProperties = {
  width: '100%',
  height: '80px',
  background: '#f5f0ea',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}
