'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/client'
import type { City, CityInput } from '@/lib/types/city'

/**
 * Get all cities
 */
export async function getCities(): Promise<City[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('population', { ascending: false })

    if (error) {
      console.error('Get cities error:', error)
      throw new Error('Fehler beim Laden der Städte')
    }

    return data as City[]
  } catch (error) {
    console.error('Error in getCities:', error)
    return []
  }
}

/**
 * Get city by ID
 */
export async function getCityById(id: string): Promise<City | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get city error:', error)
      return null
    }

    return data as City
  } catch (error) {
    console.error('Error in getCityById:', error)
    return null
  }
}

/**
 * Create a new city
 */
export async function createCity(input: CityInput): Promise<City> {
  try {
    const supabase = createServerClient()

    // Ensure all NOT NULL fields have values
    const cityData = {
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      population: input.population ?? 0,
      digitalization_budget: input.digitalization_budget ?? 0,
      city_category: input.city_category ?? 'Kleinstadt',
      description: input.description || null,
      website: input.website || null,
    }

    const { data, error } = await supabase
      .from('cities')
      .insert(cityData)
      .select()
      .single()

    if (error) {
      console.error('Create city error:', error)
      throw new Error(`Fehler beim Erstellen der Stadt: ${error.message}`)
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return data as City
  } catch (error) {
    console.error('Error in createCity:', error)
    throw error
  }
}

/**
 * Update a city
 */
export async function updateCity(id: string, input: Partial<CityInput>): Promise<City> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('cities')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update city error:', error)
      throw new Error(`Fehler beim Aktualisieren der Stadt: ${error.message}`)
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return data as City
  } catch (error) {
    console.error('Error in updateCity:', error)
    throw error
  }
}

/**
 * Delete a city
 */
export async function deleteCity(id: string): Promise<void> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete city error:', error)
      throw new Error('Fehler beim Löschen der Stadt')
    }

    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error in deleteCity:', error)
    throw error
  }
}

/**
 * Get city statistics
 */
export async function getCityStats() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('cities')
      .select('city_category, population, digitalization_budget')

    if (error) {
      console.error('Get city stats error:', error)
      return null
    }

    if (!data) return null

    const stats = {
      total: data.length,
      totalPopulation: data.reduce((sum, city) => sum + (city.population || 0), 0),
      totalBudget: data.reduce((sum, city) => sum + (city.digitalization_budget || 0), 0),
      byCategory: {
        Großstadt: data.filter((c) => c.city_category === 'Großstadt').length,
        Mittelstadt: data.filter((c) => c.city_category === 'Mittelstadt').length,
        Kleinstadt: data.filter((c) => c.city_category === 'Kleinstadt').length,
      },
    }

    return stats
  } catch (error) {
    console.error('Error in getCityStats:', error)
    return null
  }
}

