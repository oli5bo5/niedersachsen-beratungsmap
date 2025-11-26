/**
 * TypeScript types for cities
 */

export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
  population: number
  digitalization_budget: number
  city_category: 'Großstadt' | 'Mittelstadt' | 'Kleinstadt'
  description?: string | null
  website?: string | null
  created_at: string
  updated_at: string
}

export type CityInput = Omit<City, 'id' | 'created_at' | 'updated_at'>

export const CITY_CATEGORIES = ['Großstadt', 'Mittelstadt', 'Kleinstadt'] as const

export const CITY_CATEGORY_COLORS = {
  Großstadt: '#EF4444',      // Rot
  Mittelstadt: '#F59E0B',    // Orange
  Kleinstadt: '#10B981',     // Grün
} as const

export const CITY_CATEGORY_SIZES = {
  Großstadt: 16,
  Mittelstadt: 12,
  Kleinstadt: 10,
} as const

export const CITY_CATEGORY_EMOJIS = {
  Großstadt: '🏙️',
  Mittelstadt: '🏘️',
  Kleinstadt: '🏡',
} as const

