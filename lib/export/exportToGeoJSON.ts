import { saveAs } from 'file-saver'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

/**
 * Export companies to GeoJSON format for GIS software
 */
export function exportToGeoJSON(companies: CompanyWithSpecializations[]) {
  const features = companies
    .filter((company) => company.latitude && company.longitude)
    .map((company) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [company.longitude!, company.latitude!],
      },
      properties: {
        id: company.id,
        name: company.name,
        description: company.description,
        address: company.address,
        website: company.website,
        email: company.email,
        phone: company.phone,
        specializations: company.specializations.map((s) => ({
          name: s.name,
          icon: s.icon,
          color: s.color,
        })),
        created_at: company.created_at,
        updated_at: company.updated_at,
      },
    }))

  const geojson = {
    type: 'FeatureCollection',
    features,
  }

  // Create and download file
  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: 'application/geo+json',
  })

  const filename = `niedersachsen-beratungsunternehmen-${Date.now()}.geojson`
  saveAs(blob, filename)
}

