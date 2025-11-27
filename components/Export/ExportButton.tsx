'use client'

import { useState } from 'react'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'
import { exportToCSV } from '@/lib/export/exportToCSV'
import { exportToGeoJSON } from '@/lib/export/exportToGeoJSON'
import { exportToPDF } from '@/lib/export/exportToPDF'

interface ExportButtonProps {
  companies: CompanyWithSpecializations[]
}

export default function ExportButton({ companies }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'geojson' | 'pdf') => {
    setIsExporting(true)
    setIsOpen(false)

    try {
      switch (format) {
        case 'csv':
          exportToCSV(companies)
          break
        case 'geojson':
          exportToGeoJSON(companies)
          break
        case 'pdf':
          exportToPDF(companies)
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Fehler beim Export')
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isExporting ? (
          <>
            <span className="animate-spin">⏳</span>
            Exportiere...
          </>
        ) : (
          <>
            📥 Exportieren
            <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20">
            <button
              onClick={() => handleExport('csv')}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <span className="text-xl">📊</span>
              <div>
                <div className="font-medium">CSV</div>
                <div className="text-xs text-gray-500">Excel, Tabellen</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('geojson')}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors border-t"
            >
              <span className="text-xl">🗺️</span>
              <div>
                <div className="font-medium">GeoJSON</div>
                <div className="text-xs text-gray-500">GIS-Software</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors border-t rounded-b-lg"
            >
              <span className="text-xl">📄</span>
              <div>
                <div className="font-medium">PDF</div>
                <div className="text-xs text-gray-500">Dokument</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}



