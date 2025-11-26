'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getCompanies, getSpecializations, deleteCompany } from '../actions/companies'
import { getCities } from '../actions/cities'
import type { CompanyWithSpecializations, Specialization } from '@/lib/supabase/types'
import type { City } from '@/lib/types/city'
import AddCompanyForm from '@/components/Admin/AddCompanyForm'
import AddCityForm from '@/components/Admin/AddCityForm'
import CityList from '@/components/Admin/CityList'

// Dynamic import for Map component (client-side only)
const MapComponent = dynamic(
  () => import('@/components/Map/MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
)

export default function AdminPage() {
  const [companies, setCompanies] = useState<CompanyWithSpecializations[]>([])
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadData = async () => {
    try {
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id)
      await loadData() // Reload data
      setDeleteConfirm(null)
    } catch (err) {
      alert('Fehler beim Löschen')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Lade Admin-Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            🔧 Admin Panel
          </h1>
          <p className="text-sm text-gray-600">
            Unternehmen verwalten
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Add City Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <AddCityForm onSuccess={loadData} />
            </div>

            {/* Add Company Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Neues Unternehmen</h2>
              <AddCompanyForm
                specializations={specializations}
                onSuccess={loadData}
              />
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Kartenvorschau</h2>
              <div className="h-[600px] rounded-lg overflow-hidden border">
                <MapComponent companies={companies} allCities={cities} />
              </div>
            </div>
          </div>
          
          {/* Cities Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              Verwaltete Städte ({cities.length})
            </h2>
            <CityList cities={cities} />
          </div>

          {/* Companies Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Alle Unternehmen ({companies.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Adresse</th>
                    <th className="px-4 py-2 text-left">Spezialisierungen</th>
                    <th className="px-4 py-2 text-left">Kontakt</th>
                    <th className="px-4 py-2 text-center">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{company.name}</div>
                        {company.description && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {company.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {company.address || '-'}
                      </td>
                      <td className="px-4 py-3">
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
                              {spec.icon}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {company.email && (
                          <div className="text-xs">✉️ {company.email}</div>
                        )}
                        {company.phone && (
                          <div className="text-xs">📞 {company.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {deleteConfirm === company.id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(company.id)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Bestätigen
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                            >
                              Abbrechen
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(company.id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Löschen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {companies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Noch keine Unternehmen vorhanden
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

