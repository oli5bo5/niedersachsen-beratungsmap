'use client'

import { MapPin, Users, Euro, Building2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { City } from '@/lib/types/city'
import { CITY_CATEGORY_COLORS, CITY_CATEGORY_EMOJIS } from '@/lib/types/city'

interface CityCardProps {
  city: City
  companyCount: number
  onShowOnMap?: () => void
  selected?: boolean
  className?: string
}

export default function CityCard({
  city,
  companyCount,
  onShowOnMap,
  selected,
  className,
}: CityCardProps) {
  const categoryColor = CITY_CATEGORY_COLORS[city.city_category]
  const categoryEmoji = CITY_CATEGORY_EMOJIS[city.city_category]

  // Format numbers
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calculate budget per capita
  const budgetPerCapita = city.population > 0 
    ? city.digitalization_budget / city.population 
    : 0

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        selected && 'ring-2 ring-primary shadow-xl scale-[1.02]',
        className
      )}
      onClick={onShowOnMap}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">{categoryEmoji}</div>
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {city.name}
              </CardTitle>
              <Badge
                variant="secondary"
                className="mt-1 text-xs"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                  borderColor: `${categoryColor}30`,
                }}
              >
                {city.city_category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Population */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Einwohner</span>
            <span className="text-sm font-semibold">
              {formatNumber(city.population)}
            </span>
          </div>

          {/* Budget */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Euro className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Budget</span>
            <span className="text-sm font-semibold">
              {formatCurrency(city.digitalization_budget)}
            </span>
          </div>

          {/* Companies */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Firmen</span>
            <span className="text-sm font-semibold text-primary">
              {companyCount}
            </span>
          </div>
        </div>

        {/* Budget per Capita Progress */}
        {budgetPerCapita > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget pro Einwohner</span>
              <span className="font-medium">{formatCurrency(budgetPerCapita)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((budgetPerCapita / 200) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        {city.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
            {city.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
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
        {city.website && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={city.website}
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

