/**
 * Geocoding utilities using Nominatim API
 */

export interface GeocodingResult {
  lat: number
  lng: number
  display_name?: string
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'
const USER_AGENT = 'NiedersachsenBeratungsMap/1.0'

/**
 * Geocode an address to coordinates using Nominatim API
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || address.trim().length === 0) {
    throw new Error('Address cannot be empty')
  }

  try {
    const params = new URLSearchParams({
      format: 'json',
      q: address,
      countrycodes: 'de',
      limit: '1',
    })

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      throw new Error('Address not found. Please check the address and try again.')
    }

    const result = data[0]

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to geocode address')
  }
}

/**
 * Reverse geocode coordinates to an address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString(),
    })

    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    return data.display_name || 'Unknown location'
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return 'Unknown location'
  }
}

