'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { getSupabaseCompanies, deleteSupabaseCompany } from '@/app/actions/supabase-companies'
import { CompanyWithSpecializations } from '@/lib/types/company'

interface CompanyListProps {
  onUpdate?: () => void
}

export default function CompanyList({ onUpdate }: CompanyListProps) {
  const [companies, setCompanies] = useState<CompanyWithSpecializations[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyWithSpecializations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Lade Unternehmen
  useEffect(() => {
    loadCompanies()
  }, [])

  async function loadCompanies() {
    try {
      setLoading(true)
      const data = await getSupabaseCompanies()
      setCompanies(data)
      setFilteredCompanies(data)
    } catch (error) {
      console.error('Fehler beim Laden:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter-Logik
  useEffect(() => {
    let filtered = companies

    // Suchfilter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Städtefilter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(c => c.city === selectedCity)
    }

    setFilteredCompanies(filtered)
  }, [searchQuery, selectedCity, companies])

  // Delete Handler
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Möchtest du "${name}" wirklich löschen?`)) return

    try {
      setDeletingId(id)
      await deleteSupabaseCompany(id)
      await loadCompanies()
      onUpdate?.()
    } catch (error) {
      alert('Fehler beim Löschen: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
    } finally {
      setDeletingId(null)
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      {/* COMPANY CARDS */}
      {/* ============================================ */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
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
                    disabled={deletingId === company.id}
                    className="px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 disabled:opacity-50"
                    title="Löschen"
                  >
                    {deletingId === company.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="text-sm">Löschen</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

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

