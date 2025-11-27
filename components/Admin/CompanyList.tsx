'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import { 
  Trash2, 
  Edit, 
  MapPin, 
  Globe, 
  Phone,
  Mail,
  Search,
  Filter,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useCompanies, useDeleteCompany } from '@/lib/hooks/useCompanies'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { CompanyWithSpecializations } from '@/lib/types/company'

interface CompanyListProps {
  onUpdate?: () => void
}

export default function CompanyList({ onUpdate }: CompanyListProps) {
  const { data: companies = [], isLoading: loading } = useCompanies()
  const deleteMutation = useDeleteCompany()
  
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)
  const [selectedCity, setSelectedCity] = useState<string>('all')
  
  const parentRef = useRef<HTMLDivElement>(null)

  // Filter-Logik
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = !debouncedSearch || 
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(debouncedSearch.toLowerCase())
    
    const matchesCity = selectedCity === 'all' || c.city === selectedCity
    
    return matchesSearch && matchesCity
  })

  // Virtualization
  const virtualizer = useVirtualizer({
    count: filteredCompanies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  })

  // Delete Handler
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Möchtest du "${name}" wirklich löschen?`)) return

    try {
      await deleteMutation.mutateAsync(id)
      onUpdate?.()
    } catch (error) {
      alert('Fehler beim Löschen: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
    }
  }

  // Unique Cities
  const cities = Array.from(new Set(companies.map(c => c.city))).sort()

  if (loading) {
    return (
      <div className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-12 flex items-center justify-center shadow-lg">
        <Loader2 className="w-8 h-8 text-frameio-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* HEADER & FILTERS */}
      {/* ============================================ */}
      <div className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
            <input
              type="search"
              placeholder="Unternehmen suchen..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 pr-10 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all">Alle Städte</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city} ({companies.filter(c => c.city === city).length})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary pointer-events-none" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-frameio-text-secondary">
            {filteredCompanies.length} von {companies.length} Unternehmen
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* VIRTUALIZED COMPANY CARDS */}
      {/* ============================================ */}
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const company = filteredCompanies[virtualItem.index]
            
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 hover:shadow-lg transition-shadow mb-4"
              >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info */}
                <div className="flex-1">
                  {/* Name & City */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-frameio-text-primary mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 text-frameio-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{company.city}</span>
                        {company.address && (
                          <span className="text-sm">• {company.address}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p className="text-sm text-frameio-text-secondary mb-4 line-clamp-2">
                      {company.description}
                    </p>
                  )}

                  {/* Specializations */}
                  {company.company_specializations && company.company_specializations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.company_specializations.map((cs) => (
                        <span
                          key={cs.specializations.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: `${cs.specializations.color}15`,
                            color: cs.specializations.color,
                            borderColor: `${cs.specializations.color}30`
                          }}
                        >
                          {cs.specializations.icon} {cs.specializations.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-frameio-text-secondary">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-frameio-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {company.phone && (
                      <a
                        href={`tel:${company.phone}`}
                        className="flex items-center gap-1.5 hover:text-frameio-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{company.phone}</span>
                      </a>
                    )}
                    {company.email && (
                      <a
                        href={`mailto:${company.email}`}
                        className="flex items-center gap-1.5 hover:text-frameio-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{company.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl border-2 border-frameio-border hover:border-frameio-primary hover:bg-frameio-primary/5 transition-colors flex items-center gap-2 text-frameio-text-primary"
                    title="Bearbeiten"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Bearbeiten</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(company.id, company.name)}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 disabled:opacity-50"
                    title="Löschen"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="text-sm">Löschen</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
          })}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-12 text-center shadow-lg"
          >
            <p className="text-frameio-text-secondary">
              Keine Unternehmen gefunden.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

