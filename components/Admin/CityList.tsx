'use client'

import { useState } from 'react'
import { deleteCity } from '@/app/actions/cities'
import type { City } from '@/lib/types/city'
import { CITY_CATEGORY_COLORS } from '@/lib/types/city'

interface Props {
  cities: City[]
}

export default function CityList({ cities }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Möchtest du ${name} wirklich löschen?`)) return

    setDeletingId(id)
    try {
      await deleteCity(id)
      window.location.reload()
    } catch (error) {
      alert('Fehler beim Löschen')
    } finally {
      setDeletingId(null)
    }
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stadt
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Kategorie
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Einwohner
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Digitalbudget
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cities.map((city) => (
            <tr key={city.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium text-gray-900">{city.name}</p>
                  {city.website && (
                    <a
                      href={city.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: CITY_CATEGORY_COLORS[city.city_category] }}
                >
                  {city.city_category}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  👥 {formatNumber(city.population)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  💶 {formatCurrency(city.digitalization_budget)}
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  onClick={() => handleDelete(city.id, city.name)}
                  disabled={deletingId === city.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 px-3 py-1 rounded hover:bg-red-50"
                >
                  {deletingId === city.id ? '⏳' : '🗑️'} Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Noch keine Städte vorhanden. Füge die erste Stadt hinzu!
        </div>
      )}
    </div>
  )
}





