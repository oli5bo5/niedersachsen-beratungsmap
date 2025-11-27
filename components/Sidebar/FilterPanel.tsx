'use client'

import { Search, X, Check } from 'lucide-react'
import type { Specialization, FilterState } from '@/lib/supabase/types'

interface FilterPanelProps {
  specializations: Specialization[]
  filterState: FilterState
  citiesWithCounts: Array<{ city: string; count: number }>
  selectedCity: string | null
  setSearchQuery: (query: string) => void
  toggleSpecialization: (id: string) => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  setSelectedCity: (city: string | null) => void
  clearFilters: () => void
}

export default function FilterPanel({
  specializations,
  filterState,
  citiesWithCounts,
  selectedCity,
  setSearchQuery,
  toggleSpecialization,
  setSortBy,
  setSelectedCity,
  clearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = filterState.selectedSpecializations.length > 0 || selectedCity !== null || filterState.searchQuery !== ''

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Alle Filter zurücksetzen
        </button>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Unternehmen suchen..."
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="frameio-input w-full pl-10"
        />
        {filterState.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary/50"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Specializations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Spezialisierungen
        </h4>
        <div className="space-y-2">
          {specializations.map((spec) => {
            const isSelected = filterState.selectedSpecializations.includes(spec.id)
            return (
              <label
                key={spec.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 
                         cursor-pointer transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSpecialization(spec.id)}
                    className="peer sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 
                                 flex items-center justify-center
                                 ${isSelected 
                                   ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent' 
                                   : 'border-border'}`}>
                    <Check className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
                <span className="text-lg">{spec.icon}</span>
                <span className="text-sm font-medium flex-1">{spec.name}</span>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                  {/* Could show count per specialization here */}
                  {spec.name === 'Digitalisierung' ? '12' : 
                   spec.name === 'KI-Beratung' ? '8' : 
                   spec.name === 'Cloud-Migration' ? '10' : 
                   spec.name === 'Cybersecurity' ? '6' : '7'}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Cities */}
      {citiesWithCounts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Städte
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {citiesWithCounts.map(({ city, count }) => (
              <button
                key={city}
                onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                className={`w-full flex items-center justify-between p-3 rounded-xl
                         transition-all duration-200
                         ${selectedCity === city 
                           ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 ring-2 ring-primary/50' 
                           : 'hover:bg-secondary/50'}`}
              >
                <span className="text-sm font-medium">{city}</span>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Sortierung
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'alphabetical' as const, label: 'Name (A-Z)' },
            { value: 'newest' as const, label: 'Neueste' },
            { value: 'nearest' as const, label: 'Nächste' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all
                       ${filterState.sortBy === option.value
                         ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)]'
                         : 'bg-secondary/50 hover:bg-secondary'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
