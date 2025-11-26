'use client'

import { useState, useMemo } from 'react'
import type { City } from '@/lib/types/city'
import { CITY_CATEGORY_COLORS, CITY_CATEGORY_EMOJIS } from '@/lib/types/city'

interface CityDropdownProps {
  cities: City[]
  onCitySelect: (city: City) => void
}

// Helper to match selected city by name
function isSameCity(city: City, selectedName: string | null): boolean {
  return selectedName ? city.name === selectedName : false
}

export default function CityDropdown({ cities, onCitySelect }: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  // Sort cities alphabetically
  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => a.name.localeCompare(b.name, 'de'))
  }, [cities])

  const handleCityClick = (city: City) => {
    setSelectedCity(city)
    setIsOpen(false)
    onCitySelect(city)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
  }

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-gray-700">
          {selectedCity ? selectedCity.name : '🏙️ Städte auswählen'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-[1100] max-h-80 overflow-y-auto">
          {sortedCities.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Keine Städte vorhanden
            </div>
          ) : (
            sortedCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                  border-b border-gray-100 last:border-b-0
                  ${selectedCity?.id === city.id ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  {/* Category Indicator */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CITY_CATEGORY_COLORS[city.city_category] }}
                    title={city.city_category}
                  />
                  
                  {/* City Name */}
                  <span className="font-medium text-gray-900 flex-1">
                    {city.name}
                  </span>

                  {/* Population */}
                  {city.population > 0 && (
                    <span className="text-xs text-gray-500">
                      ({formatNumber(city.population)})
                    </span>
                  )}
                </div>

                {/* Specializations Icons */}
                {city.specializations && city.specializations.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {city.specializations.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {getSpecializationIcon(spec)}
                      </span>
                    ))}
                    {city.specializations.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{city.specializations.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1099]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Helper function to get specialization icon
function getSpecializationIcon(spec: string): string {
  const icons: Record<string, string> = {
    'Cloud-Migration': '☁️',
    'Cybersecurity': '🔒',
    'Digitalisierung': '📱',
    'KI-Beratung': '🤖',
    'Prozessoptimierung': '⚙️',
  }
  return icons[spec] || '📍'
}

