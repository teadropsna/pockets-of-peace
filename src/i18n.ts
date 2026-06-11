import type { Lang } from './types'

export const i18n = {
  en: {
    btn: '📍 Find quiet spots near me',
    locating: 'Locating…',
    fetching: 'Fetching spots…',
    done: (n: number) => `${n} spots found`,
    error_geo: 'Location unavailable.',
    error_api: 'Could not fetch data.',
    legend_quiet: 'Quiet / recommended',
  },
  ja: {
    btn: '📍 近くの静かな場所を探す',
    locating: '位置情報を取得中…',
    fetching: 'スポットを取得中…',
    done: (n: number) => `${n} 件見つかりました`,
    error_geo: '位置情報を取得できませんでした。',
    error_api: 'データを取得できませんでした。',
    legend_quiet: '静か・おすすめ',
  },
} satisfies Record<Lang, object>

export type Translations = (typeof i18n)[Lang]
