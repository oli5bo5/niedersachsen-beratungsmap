'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map as MapIcon, 
  Building2, 
  MapPin, 
  Search, 
  Menu, 
  X,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Plus,
  Download
} from 'lucide-react'
import { getCompanies, getSpecializations } from './actions/companies'
import { getCities } from './actions/cities'
import type { CompanyWithSpecializations, Specialization } from '@/lib/supabase/types'
import type { City } from '@/lib/types/city'
import FilterPanel from '@/components/Sidebar/FilterPanel'
import ExportButton from '@/components/Export/ExportButton'
import AddCompanyModal from '@/components/Modal/AddCompanyModal'
import MobileFilterSheet from '@/components/mobile/MobileFilterSheet'
import { useCompanyFilters } from '@/hooks/useCompanyFilters'

// Dynamic import for Map component (client-side only) with Frame.io Loading
import MapLoadingSkeleton from '@/components/loading/MapLoadingSkeleton'

const MapComponent = dynamic(
  () => import('@/components/Map/MapWithClustering'),
  { 
    ssr: false,
    loading: () => <MapLoadingSkeleton />
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
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

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

  // Find city object when city name is selected (Hook gives string, we need object for map)
  const selectedCityObject = selectedCity 
    ? cities.find(c => c.name === selectedCity) || null
    : null

  // Filter cities to only show those with companies (for CityDropdown)
  const citiesWithCompanies = cities.filter(city => 
    citiesWithCounts.some(cityWithCount => cityWithCount.city === city.name)
  )

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

  const handleCompanyAdded = () => {
    // Reload data to show new company
    loadData()
  }

  if (isLoading) {
    return <MapLoadingSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="frameio-card max-w-md border-l-4 border-red-500"
        >
          <p className="font-bold text-lg mb-2">⚠️ Fehler</p>
          <p className="text-muted-foreground">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10">
      
      {/* Frame.io Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 
                      bg-background/80 backdrop-blur-xl 
                      border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 
                            rounded-2xl flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Niedersachsen</h1>
              <p className="text-xs text-muted-foreground">Beratungsmap</p>
            </div>
          </div>
          
          {/* Desktop Stats */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">{companies.length}</span>
              <span className="text-muted-foreground">Unternehmen</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="font-semibold">{cities.length}</span>
              <span className="text-muted-foreground">Städte</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`frameio-card px-4 py-2 rounded-full text-sm font-medium
                       hover:scale-105 transition-transform hidden lg:flex items-center gap-2
                       ${showFilters ? 'ring-2 ring-primary' : ''}`}
            >
              <Layers className="w-4 h-4" />
              Filter
            </button>
            
            <button
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="hidden sm:flex frameio-button text-sm px-4 py-2 items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Hinzufügen
            </button>
            
            <div className="hidden sm:block">
              <ExportButton companies={companies} />
            </div>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden frameio-card w-10 h-10 rounded-full 
                       flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 
                       bg-background/95 backdrop-blur-xl 
                       border-b border-border/50 md:hidden"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              <button 
                onClick={() => setIsAddCompanyModalOpen(true)}
                className="w-full frameio-button flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Unternehmen hinzufügen
              </button>
              <div className="w-full">
                <ExportButton companies={companies} />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-xl
                             hover:bg-secondary/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={showCities}
                  onChange={(e) => setShowCities(e.target.checked)}
                  className="rounded"
                />
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Städte anzeigen</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Map Area */}
      <main className="flex-1 pt-16">
        <div className="h-[calc(100vh-4rem)] relative">
          
          {/* Map Component */}
          <MapComponent
            companies={filteredCompanies}
            allCities={cities}
            selectedCompanyId={selectedCompanyId}
            onMarkerClick={setSelectedCompanyId}
            showCities={showCities}
            hasActiveFilters={filterState.selectedSpecializations.length > 0}
            selectedCity={selectedCityObject}
          />
          
          {/* Floating Filter Panel - Links (Desktop only) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-6 left-6 z-[1000] 
                           frameio-card w-80 max-h-[calc(100vh-140px)]
                           overflow-y-auto custom-scrollbar
                           hidden lg:block"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filter</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-lg hover:bg-secondary/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <FilterPanel
                    specializations={specializations}
                    filterState={filterState}
                    citiesWithCounts={citiesWithCounts}
                    selectedCity={selectedCity}
                    setSearchQuery={setSearchQuery}
                    toggleSpecialization={toggleSpecialization}
                    setSortBy={setSortBy}
                    setSelectedCity={setSelectedCity}
                    clearFilters={clearFilters}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stats Card - Unten Links */}
          <div className="absolute bottom-6 left-6 z-[1000] 
                          frameio-card hidden md:block">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{filteredCompanies.length}</div>
                <div className="text-xs text-muted-foreground">Unternehmen</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{filterState.selectedSpecializations.length || 'Alle'}</div>
                <div className="text-xs text-muted-foreground">Filter aktiv</div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setMobileFilterOpen(true)}
            className="fixed bottom-20 right-6 z-[1000] 
                       frameio-button w-14 h-14 rounded-full 
                       shadow-[0_12px_30px_rgba(99,102,241,0.4)]
                       flex items-center justify-center
                       lg:hidden"
          >
            <Layers className="w-6 h-6" />
          </button>
        </div>
      </main>
      
      {/* Mobile Filter Sheet */}
      <MobileFilterSheet 
        isOpen={mobileFilterOpen} 
        onClose={() => setMobileFilterOpen(false)}
      >
        <FilterPanel
          specializations={specializations}
          filterState={filterState}
          citiesWithCounts={citiesWithCounts}
          selectedCity={selectedCity}
          setSearchQuery={setSearchQuery}
          toggleSpecialization={toggleSpecialization}
          setSortBy={setSortBy}
          setSelectedCity={setSelectedCity}
          clearFilters={clearFilters}
        />
      </MobileFilterSheet>
      
      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSuccess={handleCompanyAdded}
        specializations={specializations}
      />
    </div>
  )
}

