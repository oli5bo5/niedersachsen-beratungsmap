'use client'

import { useState, useMemo } from 'react'
import type { CompanyWithSpecializations, Specialization, FilterState, SortOption } from '@/lib/supabase/types'
import { useCompanyFilters } from '@/hooks/useCompanyFilters'
import FilterPanel from './FilterPanel'

interface CompanyListProps {
  companies: CompanyWithSpecializations[]
  specializations: Specialization[]
  selectedCompany?: string
  onSelectCompany: (id: string) => void
  // Filter props from parent
  filterState: FilterState
  setSearchQuery: (query: string) => void
  toggleSpecialization: (id: string) => void
  setSortBy: (sortBy: SortOption) => void
  clearFilters: () => void
}

export default function CompanyList({
  companies,
  specializations,
  selectedCompany,
  onSelectCompany,
  filterState,
  setSearchQuery: updateSearchQuery,
  toggleSpecialization,
  setSortBy,
  clearFilters,
}: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  // Use the filter hook locally to get filtered companies for display
  const { filteredCompanies } = useCompanyFilters(companies)

  // Apply the filter state from parent
  const displayCompanies = useMemo(() => {
    let result = [...companies]

    // Filter by search query
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase()
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.description?.toLowerCase().includes(query) ||
          company.address?.toLowerCase().includes(query)
      )
    }

    // Filter by specializations
    if (filterState.selectedSpecializations.length > 0) {
      result = result.filter((company) =>
        company.specializations.some((spec) =>
          filterState.selectedSpecializations.includes(spec.id)
        )
      )
    }

    // Sort
    switch (filterState.sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
    }

    return result
  }, [companies, filterState])

  // Debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Simple debouncing with setTimeout
    const timeoutId = setTimeout(() => {
      updateSearchQuery(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-[999]
          w-full lg:w-auto
          bg-white shadow-lg
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Beratungsunternehmen
            </h2>
            <p className="text-sm text-gray-600">
              {displayCompanies.length} von {companies.length} Unternehmen
            </p>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Firma suchen..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <FilterPanel
            specializations={specializations}
            selectedSpecializations={filterState.selectedSpecializations}
            onToggleSpecialization={toggleSpecialization}
            sortBy={filterState.sortBy}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />

          {/* Company List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {displayCompanies.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Keine Unternehmen gefunden
              </div>
            ) : (
              <div className="p-2">
                {displayCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => onSelectCompany(company.id)}
                    className={`
                      company-card w-full text-left mb-2
                      ${selectedCompany === company.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    `}
                  >
                    <h3 className="font-semibold text-base mb-1">
                      {company.name}
                    </h3>

                    {company.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {company.description}
                      </p>
                    )}

                    {company.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {company.specializations.map((spec) => (
                          <span
                            key={spec.id}
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: spec.color + '20',
                              color: spec.color,
                            }}
                          >
                            {spec.icon} {spec.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {company.address && (
                      <p className="text-xs text-gray-500 mt-2">
                        📍 {company.address}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

