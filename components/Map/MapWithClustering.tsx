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
import type { City } from '@/lib/types/city'
import { CITY_CATEGORY_COLORS, CITY_CATEGORY_SIZES, CITY_CATEGORY_EMOJIS } from '@/lib/types/city'

interface MapWithClusteringProps {
  companies: CompanyWithSpecializations[]
  cities?: City[]
  selectedCompanyId?: string
  onMarkerClick?: (companyId: string) => void
  onCityClick?: (cityId: string) => void
  enableClustering?: boolean
  showCities?: boolean
}

export default function MapWithClustering({
  companies,
  cities = [],
  selectedCompanyId,
  onMarkerClick,
  onCityClick,
  enableClustering = true,
  showCities = true,
}: MapWithClusteringProps) {
  const [geojsonData, setGeojsonData] = useState<any>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
    })
  }, [])

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

        {/* City markers */}
        {showCities && L && cities.map((city) => {
          const Marker = require('react-leaflet').Marker
          const Popup = require('react-leaflet').Popup
          
          const size = CITY_CATEGORY_SIZES[city.city_category]
          const color = CITY_CATEGORY_COLORS[city.city_category]
          const emoji = CITY_CATEGORY_EMOJIS[city.city_category]
          
          const cityIcon = L.divIcon({
            className: 'custom-city-marker',
            html: `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${size * 0.6}px;
                z-index: 400;
              ">
                ${emoji}
              </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          })
          
          const formatNumber = (value: number) => new Intl.NumberFormat('de-DE').format(value)
          const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
          }).format(value)
          
          return (
            <Marker
              key={city.id}
              position={[city.latitude, city.longitude]}
              icon={cityIcon}
              eventHandlers={{ click: () => onCityClick?.(city.id) }}
            >
              <Popup>
                <div className="p-3 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{emoji}</span>
                    <h3 className="text-lg font-bold">{city.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {city.city_category}
                    </span>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div>
                        <p className="text-gray-500 text-xs">Einwohner</p>
                        <p className="font-semibold">👥 {formatNumber(city.population)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Digitalbudget</p>
                        <p className="font-semibold">💶 {formatCurrency(city.digitalization_budget)}</p>
                      </div>
                    </div>
                    {city.description && (
                      <p className="text-gray-600 text-xs mt-2 pt-2 border-t">{city.description}</p>
                    )}
                    {city.website && (
                      <a
                        href={city.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs block mt-2"
                      >
                        🌐 Website →
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}

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
      
      {/* Legend */}
      {showCities && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] text-sm max-w-xs">
          <h4 className="font-bold mb-2 text-gray-900">Legende</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">💼</span>
              <span className="text-gray-700">Beratungsunternehmen</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-500 mb-1">Städte:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CITY_CATEGORY_COLORS.Großstadt }}
                  />
                  <span className="text-xs text-gray-700">Großstadt (&gt; 100k)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CITY_CATEGORY_COLORS.Mittelstadt }}
                  />
                  <span className="text-xs text-gray-700">Mittelstadt (20-100k)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CITY_CATEGORY_COLORS.Kleinstadt }}
                  />
                  <span className="text-xs text-gray-700">Kleinstadt (&lt; 20k)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

