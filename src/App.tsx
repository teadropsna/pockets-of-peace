import { useState } from 'react'
import PeaceMap from './components/PeaceMap'
import { fetchSpots } from './utils/overpass'
import { i18n } from './i18n'
import type { Lang, Spot } from './types'
import './App.css'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [spots, setSpots] = useState<Spot[]>([])
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const t = i18n[lang]

  async function handleFind() {
    if (!navigator.geolocation) { setStatus(t.error_geo); return }
    setLoading(true)
    setStatus(t.locating)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setUserPos([lat, lng])
        setStatus(t.fetching)
        try {
          const results = await fetchSpots(lat, lng, lang)
          setSpots(results)
          setStatus(t.done(results.length))
        } catch {
          setStatus(t.error_api)
        }
        setLoading(false)
      },
      () => { setStatus(t.error_geo); setLoading(false) },
      { timeout: 10000 }
    )
  }

  return (
    <div className="app">
      <header className="header">
        <span className="logo">🍃 Pockets of Peace</span>
        <div className="lang-switcher">
          {(['en', 'ja'] as Lang[]).map((l) => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => setLang(l)}
            >
              {l === 'en' ? 'EN' : '日本語'}
            </button>
          ))}
        </div>
      </header>

      <PeaceMap spots={spots} userPos={userPos} lang={lang} />

      <footer className="footer">
        <button className="find-btn" onClick={handleFind} disabled={loading}>
          {t.btn}
        </button>
        <span className="status">{status}</span>
      </footer>
    </div>
  )
}
