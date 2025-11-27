'use client'

import { Building2, MapPin, ExternalLink, Info } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

interface CompanyCardProps {
  company: CompanyWithSpecializations
  onShowOnMap?: () => void
  onShowDetails?: () => void
  selected?: boolean
  className?: string
}

export default function CompanyCard({
  company,
  onShowOnMap,
  onShowDetails,
  selected,
  className,
}: CompanyCardProps) {
  // Get initials for avatar
  const initials = company.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Get visible specializations (max 3)
  const visibleSpecs = company.specializations?.slice(0, 3) || []
  const remainingCount = (company.specializations?.length || 0) - 3

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        selected && 'ring-2 ring-primary shadow-xl scale-[1.02]',
        className
      )}
      onClick={onShowDetails}
    >
      <CardContent className="p-4">
        {/* Header with Avatar */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            {company.city && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{company.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {company.description}
          </p>
        )}

        {/* Specializations */}
        {visibleSpecs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {visibleSpecs.map((spec) => (
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
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingCount} mehr
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation()
            onShowOnMap?.()
          }}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Auf Karte
        </Button>
        {company.website && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

