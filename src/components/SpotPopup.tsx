import type { Spot, Lang } from '../types'
import { getPlaceInfo } from '../utils/placeLabel'

interface Props {
  spot: Spot
  lang: Lang
}

export default function SpotPopup({ spot, lang }: Props) {
  const place = getPlaceInfo(spot.tags)
  const { wiki } = spot

  return (
    <div style={{ width: '220px', fontFamily: 'Georgia, serif' }}>
      <div style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden' }}>
        <img
          src={wiki.thumbnail.source}
          alt={wiki.title}
          style={{ width: '100%', maxHeight: '130px', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* 場所の種別バッジ */}
      <div style={{ fontSize: '0.72rem', color: '#7BAE7F', fontWeight: 'bold', marginBottom: '2px' }}>
        {place.emoji} {place.label[lang]}
      </div>

      {/* 固有名 */}
      <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
        {wiki.title}
      </div>

      {/* Wikipedia の短い説明（description = サブタイトル的な一行） */}
      {wiki.description && (
        <div style={{ fontSize: '0.72rem', color: '#999', marginBottom: '4px' }}>
          {wiki.description}
        </div>
      )}

      {/* 本文抜粋 */}
      <div style={{ fontSize: '0.82rem', color: '#5a5050', lineHeight: '1.55' }}>
        {wiki.extract ? truncate(wiki.extract, 120) : place.desc[lang]}
      </div>

      {/* Wikipedia へのリンク */}
      {wiki.pageUrl && (
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

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}
