'use client'

import { Marker, Popup } from 'react-leaflet'
import { MapPin, Globe, Mail, Phone, ExternalLink } from 'lucide-react'
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
        <div className="p-4 space-y-4 min-w-[300px]">
          {/* Header with Gradient Avatar */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 
                            flex items-center justify-center text-white text-lg font-bold
                            shadow-[0_8px_20px_rgba(99,102,241,0.3)] flex-shrink-0">
              {company.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{company.name}</h3>
              {company.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{company.address}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Description */}
          {company.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {company.description}
            </p>
          )}

          {/* Specializations with Frame.io Badges */}
          {company.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {company.specializations.map((spec) => (
                <span
                  key={spec.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                           bg-secondary text-secondary-foreground border border-border/50"
                >
                  <span className="mr-1">{spec.icon}</span>
                  {spec.name}
                </span>
              ))}
            </div>
          )}

          {/* Contact Links */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                         bg-gradient-to-r from-indigo-500 to-purple-500
                         text-white font-semibold rounded-full text-sm 
                         hover:scale-105 transition-transform"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
            
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 
                         transition-colors flex items-center justify-center"
                title={company.email}
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            
            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 
                         transition-colors flex items-center justify-center"
                title={company.phone}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}



