import { useMemo, useState } from 'react'
import type { CompanyWithSpecializations, FilterState, SortOption } from '@/lib/supabase/types'

/**
 * Custom hook for filtering and sorting companies
 */
export function useCompanyFilters(companies: CompanyWithSpecializations[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedSpecializations: [],
    sortBy: 'alphabetical',
  })

  const filteredAndSortedCompanies = useMemo(() => {
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
      case 'nearest':
        // TODO: Implement distance-based sorting when user location is available
        break
    }

    return result
  }, [companies, filterState])

  const setSearchQuery = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }))
  }

  const toggleSpecialization = (specializationId: string) => {
    setFilterState((prev) => ({
      ...prev,
      selectedSpecializations: prev.selectedSpecializations.includes(specializationId)
        ? prev.selectedSpecializations.filter((id) => id !== specializationId)
        : [...prev.selectedSpecializations, specializationId],
    }))
  }

  const setSortBy = (sortBy: SortOption) => {
    setFilterState((prev) => ({ ...prev, sortBy }))
  }

  const clearFilters = () => {
    setFilterState({
      searchQuery: '',
      selectedSpecializations: [],
      sortBy: 'alphabetical',
    })
  }

  return {
    filteredCompanies: filteredAndSortedCompanies,
    filterState,
    setSearchQuery,
    toggleSpecialization,
    setSortBy,
    clearFilters,
  }
}

