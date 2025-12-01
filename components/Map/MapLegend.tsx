'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LegendItem {
  icon: string
  label: string
  color?: string
}

interface MapLegendProps {
  items: LegendItem[]
  className?: string
}

export default function MapLegend({ items, className }: MapLegendProps) {
  const [minimized, setMinimized] = useState(false)

  return (
    <div
      className={cn(
        'glass-card rounded-lg overflow-hidden transition-all duration-300',
        minimized ? 'w-12' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40">
        {!minimized && (
          <h3 className="font-semibold text-sm">Legende</h3>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMinimized(!minimized)}
          className="h-6 w-6"
        >
          {minimized ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Content */}
      {!minimized && (
        <div className="p-3 space-y-2 animate-fade-in">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50">
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
              </div>
              {item.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



