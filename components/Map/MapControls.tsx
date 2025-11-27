'use client'

import { Plus, Minus, Maximize2, Crosshair, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MapControlsProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitBounds?: () => void
  onLocate?: () => void
  onToggleLayers?: () => void
  className?: string
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onLocate,
  onToggleLayers,
  className,
}: MapControlsProps) {
  return (
    <div
      className={cn(
        'glass-card flex flex-col gap-1 p-1 rounded-lg',
        className
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={onZoomIn}
        className="map-control-button"
        title="Vergrößern"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onZoomOut}
        className="map-control-button"
        title="Verkleinern"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="h-px bg-border my-1" />

      <Button
        size="icon"
        variant="ghost"
        onClick={onFitBounds}
        className="map-control-button"
        title="Alles anzeigen"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onLocate}
        className="map-control-button"
        title="Mein Standort"
      >
        <Crosshair className="h-4 w-4" />
      </Button>

      <div className="h-px bg-border my-1" />

      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleLayers}
        className="map-control-button"
        title="Layer"
      >
        <Layers className="h-4 w-4" />
      </Button>
    </div>
  )
}

