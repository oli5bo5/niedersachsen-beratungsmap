'use client'

import { X, ExternalLink, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'
import type { City } from '@/lib/types/city'

interface MapInfoPanelProps {
  company?: CompanyWithSpecializations
  city?: City
  onClose: () => void
  className?: string
}

export default function MapInfoPanel({
  company,
  city,
  onClose,
  className,
}: MapInfoPanelProps) {
  if (!company && !city) return null

  return (
    <div
      className={cn(
        'glass-card rounded-lg p-4 max-w-sm animate-slide-in-left',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {company ? (
            <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
          ) : (
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          )}
          <h3 className="font-semibold text-lg">
            {company?.name || city?.name}
          </h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-6 w-6 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Company Info */}
      {company && (
        <div className="space-y-3">
          {company.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{company.city}</span>
            </div>
          )}

          {company.description && (
            <p className="text-sm text-muted-foreground">
              {company.description}
            </p>
          )}

          {company.specializations && company.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {company.specializations.map((spec) => (
                <Badge
                  key={spec.id}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: `${spec.color}15`,
                    color: spec.color,
                    borderColor: `${spec.color}30`,
                  }}
                >
                  <span className="mr-1">{spec.icon}</span>
                  {spec.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {company.website && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </a>
              </Button>
            )}
            {company.email && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={`mailto:${company.email}`}>
                  E-Mail
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* City Info */}
      {city && (
        <div className="space-y-3">
          <Badge variant="secondary">
            {city.city_category}
          </Badge>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Einwohner</p>
              <p className="text-sm font-semibold">
                {new Intl.NumberFormat('de-DE').format(city.population)}
              </p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-semibold">
                {new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                }).format(city.digitalization_budget)}
              </p>
            </div>
          </div>

          {city.description && (
            <p className="text-sm text-muted-foreground">
              {city.description}
            </p>
          )}

          {city.website && (
            <Button size="sm" variant="outline" asChild className="w-full">
              <a
                href={city.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Website besuchen
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

