import { useState, useEffect } from 'react'
import type { Spot, Lang } from '../types'
import { getPlaceInfo } from '../utils/placeLabel'
import { fetchWikiSummary, type WikiSummary } from '../utils/wikipedia'

interface Props {
  spot: Spot
  lang: Lang
}

type Status = 'idle' | 'loading' | 'done' | 'fallback'

export default function SpotPopup({ spot, lang }: Props) {
  const [wiki, setWiki] = useState<WikiSummary | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const place = getPlaceInfo(spot.tags)

  useEffect(() => {
    if (!spot.name) { setStatus('fallback'); return }
    setStatus('loading')
    fetchWikiSummary(spot.name, lang).then((result) => {
      setWiki(result)
      setStatus(result ? 'done' : 'fallback')
    })
  }, [spot.name, lang])

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
      ) : spot.name ? (
        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
          {spot.name}
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

      {/* Peace Score */}
      <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#bbb', borderTop: '1px solid #eee', paddingTop: '6px' }}>
        Peace Score: {spot.score} / 7
      </div>
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
