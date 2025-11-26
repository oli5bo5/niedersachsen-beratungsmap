'use client'

import type { Specialization, SortOption } from '@/lib/supabase/types'
import CityFilter from './CityFilter'

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
    <div className="p-4 border-b bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-700">Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Alle zurücksetzen
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Sortierung:</p>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full text-sm border rounded px-2 py-1"
        >
          <option value="alphabetical">Alphabetisch</option>
          <option value="newest">Neueste zuerst</option>
          <option value="nearest">Nächste (TODO)</option>
        </select>
      </div>

      {/* City Filter */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Standorte:</p>
        <CityFilter
          cities={cities}
          selectedCity={selectedCity}
          onCitySelect={onCitySelect}
          totalCompanies={totalCompanies}
        />
      </div>

      {/* Specializations Filter */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Spezialisierungen:</p>
        <div className="space-y-2">
          {specializations.map((spec) => (
            <label
              key={spec.id}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedSpecializations.includes(spec.id)}
                onChange={() => onToggleSpecialization(spec.id)}
                className="mr-2"
              />
              <span className="text-sm">
                {spec.icon} {spec.name}
              </span>
              <span
                className="ml-auto w-3 h-3 rounded-full"
                style={{ backgroundColor: spec.color }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

