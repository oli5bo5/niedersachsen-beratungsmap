'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'
import MapLoading from './MapLoading'

// Dynamically import Leaflet components (client-side only) with loading component
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <MapLoading />
  }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
)

// Import CustomMarker separately
import CustomMarker from './CustomMarker'

interface MapComponentProps {
  companies: CompanyWithSpecializations[]
  selectedCompanyId?: string
  onMarkerClick?: (companyId: string) => void
}

export default function MapComponent({
  companies,
  selectedCompanyId,
  onMarkerClick,
}: MapComponentProps) {
  const [geojsonData, setGeojsonData] = useState<any>(null)
  const [map, setMap] = useState<any>(null)

  // Load GeoJSON data
  useEffect(() => {
    fetch('/maps/niedersachsen.geojson')
      .then((res) => res.json())
      .then((data) => setGeojsonData(data))
      .catch((err) => console.error('Error loading GeoJSON:', err))
  }, [])

  // Zoom to selected company
  useEffect(() => {
    if (map && selectedCompanyId) {
      const company = companies.find((c) => c.id === selectedCompanyId)
      if (company?.latitude && company?.longitude) {
        map.flyTo([company.latitude, company.longitude], 12, {
          duration: 1.5,
        })
      }
    }
  }, [map, selectedCompanyId, companies])

  // Hannover center coordinates
  const center: [number, number] = [52.3759, 9.732]
  const zoom = 7.5

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Niedersachsen border */}
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={{
              color: '#3B82F6',
              weight: 3,
              fillColor: '#3B82F6',
              fillOpacity: 0.1,
            }}
          />
        )}

        {/* Company markers */}
        {companies.map((company) => (
          <CustomMarker
            key={company.id}
            company={company}
            onClick={onMarkerClick}
          />
        ))}
      </MapContainer>
    </div>
  )
}

