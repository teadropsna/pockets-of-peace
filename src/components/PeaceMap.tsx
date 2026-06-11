import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Spot, Lang } from '../types'
import { QUIET_MARKER } from '../utils/score'
import SpotPopup from './SpotPopup'
import { i18n } from '../i18n'

interface FlyToProps {
  center: [number, number]
}

function FlyTo({ center }: FlyToProps) {
  const map = useMap()
  map.flyTo(center, 16)
  return null
}

interface LegendProps {
  lang: Lang
}

function Legend({ lang }: LegendProps) {
  const map = useMapEvents({})
  const t = i18n[lang]

  useEffect(() => {
    const control = new L.Control({ position: 'bottomleft' })
    control.onAdd = () => {
      const div = L.DomUtil.create('div')
      div.style.cssText = 'background:#FAF6F0;border:1px solid #e0d8cc;border-radius:6px;padding:8px 10px;font-size:0.75rem;line-height:1.8;font-family:Georgia,serif;'
      const dot = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#5a9e60;margin-right:5px;vertical-align:middle;"></span>`
      div.innerHTML = `${dot}${t.legend_quiet}`
      return div
    }
    control.addTo(map)
    return () => { control.remove() }
  }, [map, lang])

  return null
}

interface Props {
  spots: Spot[]
  userPos: [number, number] | null
  lang: Lang
}

export default function PeaceMap({ spots, userPos, lang }: Props) {
  return (
    <MapContainer
      center={[35.6812, 139.7671]}
      zoom={15}
      style={{ flex: 1, width: '100%', minHeight: 0 }}
    >
      <TileLayer
        attribution='© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <Legend lang={lang} />

      {userPos && (
        <>
          <FlyTo center={userPos} />
          <CircleMarker
            center={userPos}
            radius={8}
            pathOptions={{ color: '#fff', weight: 2, fillColor: '#5b8cf7', fillOpacity: 1 }}
          >
            <Popup>📍 You are here</Popup>
          </CircleMarker>
        </>
      )}

      {spots.map((spot) => (
        <CircleMarker
          key={spot.id}
          center={[spot.lat, spot.lng]}
          radius={QUIET_MARKER.radius}
          pathOptions={{
            color: QUIET_MARKER.borderColor,
            weight: QUIET_MARKER.weight,
            fillColor: QUIET_MARKER.fillColor,
            fillOpacity: QUIET_MARKER.fillOpacity,
          }}
        >
          <Popup maxWidth={240} autoPan>
            <SpotPopup spot={spot} lang={lang} />
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
