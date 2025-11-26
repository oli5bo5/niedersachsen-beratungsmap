'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getCompanies, getSpecializations } from './actions/companies'
import { getCities } from './actions/cities'
import type { CompanyWithSpecializations, Specialization } from '@/lib/supabase/types'
import type { City } from '@/lib/types/city'
import CompanyList from '@/components/Sidebar/CompanyList'
import ExportButton from '@/components/Export/ExportButton'
import AddCityModal from '@/components/Modal/AddCityModal'
import CityDropdown from '@/components/Map/CityDropdown'
import { useCompanyFilters } from '@/hooks/useCompanyFilters'

// Dynamic import for Map component (client-side only)
const MapComponent = dynamic(
  () => import('@/components/Map/MapWithClustering'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Karte wird geladen...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  const [companies, setCompanies] = useState<CompanyWithSpecializations[]>([])
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>()
  const [showCities, setShowCities] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  // Use company filters hook
  const {
    filteredCompanies,
    filterState,
    selectedCity,
    citiesWithCounts,
    setSearchQuery,
    toggleSpecialization,
    setSortBy,
    setSelectedCity,
    clearFilters,
  } = useCompanyFilters(companies)

  // Find city object when city name is selected
  const selectedCityObject = selectedCity 
    ? cities.find(c => c.name === selectedCity) || null
    : null

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Separate function so we can call it after adding a city
  const loadData = async () => {
    try {
      setIsLoading(true)
      const [companiesData, specializationsData, citiesData] = await Promise.all([
        getCompanies(),
        getSpecializations(),
        getCities(),
      ])
      setCompanies(companiesData)
      setSpecializations(specializationsData)
      setCities(citiesData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Fehler beim Laden der Daten')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityAdded = () => {
    // Reload data to show new city
    loadData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Karte...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Fehler</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🗺️ Niedersachsen Beratungsunternehmen Map
              </h1>
              <p className="text-sm text-gray-600">
                {companies.length} Unternehmen in {cities.length} Städten • Digitalisierung, KI, Cloud und mehr
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCities}
                  onChange={(e) => setShowCities(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">🏙️ Städte anzeigen</span>
              </label>
              <button
                onClick={() => setIsAddCityModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                + 🏙️ Stadt
              </button>
              <ExportButton companies={companies} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - 30% width on desktop */}
        <aside className="w-full lg:w-[400px] flex-shrink-0">
          <CompanyList
            companies={companies}
            specializations={specializations}
            selectedCompany={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
            filterState={filterState}
            selectedCity={selectedCity}
            citiesWithCounts={citiesWithCounts}
            setSearchQuery={setSearchQuery}
            toggleSpecialization={toggleSpecialization}
            setSortBy={setSortBy}
            setSelectedCity={setSelectedCity}
            clearFilters={clearFilters}
          />
        </aside>

        {/* Map - 70% width on desktop */}
        <main className="flex-1 relative">
          {/* City Dropdown */}
          {showCities && cities.length > 0 && (
            <div className="absolute top-4 right-4 z-[1000] w-64">
              <CityDropdown cities={cities} onCitySelect={setSelectedCity} />
            </div>
          )}

          <MapComponent
            companies={filteredCompanies}
            allCities={cities}
            selectedCompanyId={selectedCompanyId}
            onMarkerClick={setSelectedCompanyId}
            showCities={showCities}
            hasActiveFilters={filterState.selectedSpecializations.length > 0}
            selectedCity={selectedCityObject}
          />
        </main>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        onSuccess={handleCityAdded}
      />
    </div>
  )
}

