'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'
import MapLoading from './MapLoading'

// Dynamically import Leaflet components (client-side only)
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

// Dynamic import for MarkerClusterGroup
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
)

// Import CustomMarker separately
import CustomMarker from './CustomMarker'

interface MapWithClusteringProps {
  companies: CompanyWithSpecializations[]
  selectedCompanyId?: string
  onMarkerClick?: (companyId: string) => void
  enableClustering?: boolean
}

export default function MapWithClustering({
  companies,
  selectedCompanyId,
  onMarkerClick,
  enableClustering = true,
}: MapWithClusteringProps) {
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

  // Decide whether to use clustering based on company count
  const shouldCluster = enableClustering && companies.length > 20

  // Custom cluster icon creator
  const createClusterCustomIcon = (cluster: any) => {
    if (typeof window === 'undefined') return undefined
    
    const count = cluster.getChildCount()
    
    // Determine cluster size class
    let sizeClass = 'small'
    if (count > 50) sizeClass = 'large'
    else if (count > 20) sizeClass = 'medium'

    return new (window as any).L.divIcon({
      html: `<div class="cluster-icon cluster-${sizeClass}">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: new (window as any).L.Point(40, 40),
    })
  }

  return (
    <div className="h-full w-full relative">
      <style jsx global>{`
        .custom-cluster-icon {
          background: transparent;
          border: none;
        }
        
        .cluster-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .cluster-small {
          background-color: #3B82F6;
          font-size: 14px;
        }
        
        .cluster-medium {
          background-color: #8B5CF6;
          font-size: 16px;
          width: 50px;
          height: 50px;
        }
        
        .cluster-large {
          background-color: #EF4444;
          font-size: 18px;
          width: 60px;
          height: 60px;
        }
      `}</style>

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

        {/* Company markers with optional clustering */}
        {shouldCluster ? (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={80}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            iconCreateFunction={createClusterCustomIcon}
          >
            {companies.map((company) => (
              <CustomMarker
                key={company.id}
                company={company}
                onClick={onMarkerClick}
              />
            ))}
          </MarkerClusterGroup>
        ) : (
          <>
            {companies.map((company) => (
              <CustomMarker
                key={company.id}
                company={company}
                onClick={onMarkerClick}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  )
}

