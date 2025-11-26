'use client'

import { Marker, Popup } from 'react-leaflet'
import { createColoredIcon } from '@/lib/leaflet-config'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

interface CustomMarkerProps {
  company: CompanyWithSpecializations
  onClick?: (companyId: string) => void
}

export default function CustomMarker({ company, onClick }: CustomMarkerProps) {
  if (!company.latitude || !company.longitude) {
    return null
  }

  // Get the primary specialization for marker color
  const primarySpec = company.specializations[0]
  const color = primarySpec?.color || '#3B82F6'
  const icon = primarySpec?.icon || '📍'

  const markerIcon = createColoredIcon(color, icon)

  return (
    <Marker
      position={[company.latitude, company.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onClick?.(company.id),
      }}
    >
      <Popup>
        <div className="p-3 min-w-[250px]">
          <h3 className="font-bold text-lg mb-2">{company.name}</h3>
          
          {company.description && (
            <p className="text-sm text-gray-600 mb-2">{company.description}</p>
          )}

          {company.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {company.specializations.map((spec) => (
                <span
                  key={spec.id}
                  className="text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: spec.color + '20', color: spec.color }}
                >
                  {spec.icon} {spec.name}
                </span>
              ))}
            </div>
          )}

          {company.address && (
            <p className="text-xs text-gray-500 mb-1">📍 {company.address}</p>
          )}

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline block mb-1"
            >
              🌐 Website
            </a>
          )}

          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="text-xs text-blue-600 hover:underline block mb-1"
            >
              ✉️ {company.email}
            </a>
          )}

          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="text-xs text-blue-600 hover:underline block"
            >
              📞 {company.phone}
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

