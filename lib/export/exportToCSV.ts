import { saveAs } from 'file-saver'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

/**
 * Export companies to CSV format
 */
export function exportToCSV(companies: CompanyWithSpecializations[]) {
  // CSV headers
  const headers = [
    'Name',
    'Beschreibung',
    'Adresse',
    'Latitude',
    'Longitude',
    'Website',
    'Email',
    'Telefon',
    'Spezialisierungen',
    'Erstellt am',
  ]

  // Convert companies to CSV rows
  const rows = companies.map((company) => [
    escapeCSV(company.name),
    escapeCSV(company.description || ''),
    escapeCSV(company.address || ''),
    company.latitude || '',
    company.longitude || '',
    escapeCSV(company.website || ''),
    escapeCSV(company.email || ''),
    escapeCSV(company.phone || ''),
    escapeCSV(company.specializations.map((s) => s.name).join('; ')),
    new Date(company.created_at).toLocaleDateString('de-DE'),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Create and download file
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8',
  })
  
  const filename = `niedersachsen-beratungsunternehmen-${Date.now()}.csv`
  saveAs(blob, filename)
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

