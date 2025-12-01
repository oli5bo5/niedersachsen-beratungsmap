'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface LayerSwitcherProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showCompanies: boolean
  showCities: boolean
  showBorders: boolean
  onToggleCompanies: (show: boolean) => void
  onToggleCities: (show: boolean) => void
  onToggleBorders: (show: boolean) => void
  mapStyle?: 'default' | 'satellite' | 'terrain'
  onMapStyleChange?: (style: 'default' | 'satellite' | 'terrain') => void
}

export default function LayerSwitcher({
  open,
  onOpenChange,
  showCompanies,
  showCities,
  showBorders,
  onToggleCompanies,
  onToggleCities,
  onToggleBorders,
  mapStyle = 'default',
  onMapStyleChange,
}: LayerSwitcherProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Karteneinstellungen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Layer Toggles */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sichtbare Ebenen</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="companies" className="cursor-pointer">
                🏢 Beratungsunternehmen
              </Label>
              <Switch
                id="companies"
                checked={showCompanies}
                onCheckedChange={onToggleCompanies}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="cities" className="cursor-pointer">
                🏙️ Städte
              </Label>
              <Switch
                id="cities"
                checked={showCities}
                onCheckedChange={onToggleCities}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="borders" className="cursor-pointer">
                🗺️ Niedersachsen Grenze
              </Label>
              <Switch
                id="borders"
                checked={showBorders}
                onCheckedChange={onToggleBorders}
              />
            </div>
          </div>

          <Separator />

          {/* Map Style */}
          {onMapStyleChange && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Kartenstil</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onMapStyleChange('default')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mapStyle === 'default'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">🗺️</div>
                  <div className="text-xs">Standard</div>
                </button>

                <button
                  onClick={() => onMapStyleChange('satellite')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mapStyle === 'satellite'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">🛰️</div>
                  <div className="text-xs">Satellit</div>
                </button>

                <button
                  onClick={() => onMapStyleChange('terrain')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mapStyle === 'terrain'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">⛰️</div>
                  <div className="text-xs">Gelände</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



