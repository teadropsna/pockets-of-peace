import type { Lang } from '../types'

interface PlaceInfo {
  emoji: string
  label: Record<Lang, string>
  desc: Record<Lang, string>
}

const PLACE_MAP: { match: (tags: Record<string, string>) => boolean; info: PlaceInfo }[] = [
  {
    match: (t) => t.leisure === 'garden',
    info: {
      emoji: '🌿',
      label: { en: 'Garden', ja: '庭園・緑地' },
      desc: {
        en: 'A green garden — good for a quiet stroll or rest.',
        ja: '緑あふれる庭園。散歩や休憩にぴったりです。',
      },
    },
  },
  {
    match: (t) => t.leisure === 'park',
    info: {
      emoji: '🌳',
      label: { en: 'Park', ja: '公園' },
      desc: {
        en: 'A public park with open space.',
        ja: '緑のある公園。ベンチや広場があります。',
      },
    },
  },
  {
    match: (t) => t.amenity === 'bench',
    info: {
      emoji: '🪑',
      label: { en: 'Bench spot', ja: 'ベンチのある場所' },
      desc: {
        en: 'A bench where you can sit and take a breather.',
        ja: 'ベンチがあり、ちょっと腰を下ろして休めます。',
      },
    },
  },
  {
    match: (t) => t.landuse === 'grass',
    info: {
      emoji: '🌱',
      label: { en: 'Grass area', ja: '芝生・草地' },
      desc: {
        en: 'An open grassy area — peaceful and uncrowded.',
        ja: '芝生や草地が広がる静かなエリアです。',
      },
    },
  },
  {
    match: (t) => t.natural === 'wood' || t.natural === 'tree',
    info: {
      emoji: '🌲',
      label: { en: 'Trees / woodland', ja: '樹木・林' },
      desc: {
        en: 'Shaded by trees — cool and calm.',
        ja: '木陰があり、涼しく静かな場所です。',
      },
    },
  },
]

const FALLBACK: PlaceInfo = {
  emoji: '📍',
  label: { en: 'Quiet spot', ja: '静かなスポット' },
  desc: {
    en: 'A calm place worth checking out.',
    ja: '静かに過ごせそうな場所です。',
  },
}

export function getPlaceInfo(tags: Record<string, string>): PlaceInfo {
  return PLACE_MAP.find((p) => p.match(tags))?.info ?? FALLBACK
}
