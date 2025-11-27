'use client'

import type { Specialization, SortOption } from '@/lib/supabase/types'
import CityFilter from './CityFilter'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface CityWithCount {
  city: string
  count: number
}

interface FilterPanelProps {
  specializations: Specialization[]
  selectedSpecializations: string[]
  onToggleSpecialization: (id: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onClearFilters: () => void
  // City filter props
  cities: CityWithCount[]
  selectedCity: string | null
  onCitySelect: (city: string | null) => void
  totalCompanies: number
}

export default function FilterPanel({
  specializations,
  selectedSpecializations,
  onToggleSpecialization,
  sortBy,
  onSortChange,
  onClearFilters,
  cities,
  selectedCity,
  onCitySelect,
  totalCompanies,
}: FilterPanelProps) {
  const hasActiveFilters = selectedSpecializations.length > 0 || selectedCity !== null

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Filter</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            Zurücksetzen
          </Button>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <Label className="text-xs text-gray-600 mb-2 block">Sortierung:</Label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full text-sm text-gray-900 border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="alphabetical">Alphabetisch</option>
          <option value="newest">Neueste zuerst</option>
          <option value="nearest">Nächste (TODO)</option>
        </select>
      </div>

      {/* City Filter */}
      <div className="mb-4">
        <Label className="text-xs text-gray-600 mb-2 block">Unternehmensübersicht:</Label>
        <CityFilter
          cities={cities}
          selectedCity={selectedCity}
          onCitySelect={onCitySelect}
          totalCompanies={totalCompanies}
        />
      </div>

      <Separator className="my-4" />

      {/* Specializations Filter */}
      <div>
        <Label className="text-xs text-gray-600 mb-3 block">Spezialisierungen:</Label>
        <div className="space-y-2">
          {specializations.map((spec) => (
            <label
              key={spec.id}
              className={cn(
                "flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded-md transition-colors",
                selectedSpecializations.includes(spec.id) && "bg-blue-50"
              )}
            >
              <input
                type="checkbox"
                checked={selectedSpecializations.includes(spec.id)}
                onChange={() => onToggleSpecialization(spec.id)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xl flex-shrink-0">{spec.icon}</span>
              <span className="text-sm font-medium flex-1 text-gray-900">
                {spec.name}
              </span>
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: spec.color }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

