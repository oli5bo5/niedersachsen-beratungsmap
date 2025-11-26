'use client'

import { useState } from 'react'

interface CityWithCount {
  city: string
  count: number
}

interface CityFilterProps {
  cities: CityWithCount[]
  selectedCity: string | null
  onCitySelect: (city: string | null) => void
  totalCompanies: number
}

export default function CityFilter({
  cities,
  selectedCity,
  onCitySelect,
  totalCompanies,
}: CityFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCityClick = (city: string | null) => {
    onCitySelect(city)
    setIsOpen(false)
  }

  const getDisplayText = () => {
    if (!selectedCity) {
      return `Alle Städte (${totalCompanies})`
    }
    const cityData = cities.find((c) => c.city === selectedCity)
    return `${selectedCity} (${cityData?.count || 0})`
  }

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-sm"
      >
        <span className="flex items-center gap-2">
          <span>🏙️</span>
          <span className="font-medium text-gray-700">{getDisplayText()}</span>
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
        <>
          <div
            className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-[1100] max-h-72 overflow-y-auto"
          >
            {/* All Cities Option */}
            <button
              onClick={() => handleCityClick(null)}
              className={`
                w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors
                flex items-center justify-between border-b border-gray-100
                ${!selectedCity ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    !selectedCity ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
                <span className={`text-sm ${!selectedCity ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
                  Alle Städte
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({totalCompanies})
              </span>
            </button>

            {/* City Options */}
            {cities.map(({ city, count }) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className={`
                  w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors
                  flex items-center justify-between border-b border-gray-100 last:border-b-0
                  ${selectedCity === city ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedCity === city ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      selectedCity === city ? 'font-semibold text-blue-900' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Click outside to close */}
          <div
            className="fixed inset-0 z-[1099]"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}

