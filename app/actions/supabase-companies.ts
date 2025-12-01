'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CompanyInsert, CompanyWithSpecializations, CompanyUpdate } from '@/lib/types/company'

// ============================================
// GET COMPANIES mit Spezialisierungen
// ============================================
export async function getSupabaseCompanies(): Promise<CompanyWithSpecializations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('consulting_companies')
    .select(`
      *,
      company_specializations (
        specializations (*)
      )
    `)
    .order('name')

  if (error) {
    console.error('Error fetching companies:', error)
    throw new Error(`Fehler beim Laden der Unternehmen: ${error.message}`)
  }

  return (data || []) as CompanyWithSpecializations[]
}

// ============================================
// GET SINGLE COMPANY
// ============================================
export async function getSupabaseCompanyById(id: string): Promise<CompanyWithSpecializations | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('consulting_companies')
    .select(`
      *,
      company_specializations (
        specializations (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }

  return data as CompanyWithSpecializations
}

// ============================================
// GET ALL SPECIALIZATIONS
// ============================================
export async function getSupabaseSpecializations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('specializations')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching specializations:', error)
    throw new Error(`Fehler beim Laden der Spezialisierungen: ${error.message}`)
  }

  return data || []
}

// ============================================
// CREATE COMPANY
// ============================================
export async function createSupabaseCompany(companyData: CompanyInsert & { specialization_ids?: string[] }) {
  const supabase = await createClient()

  // Validierung
  if (!companyData.name || !companyData.city || companyData.lat === undefined || companyData.lng === undefined) {
    throw new Error('Name, Stadt und Koordinaten sind Pflichtfelder')
  }

  // Extrahiere specialization_ids
  const { specialization_ids, ...insertData } = companyData

  // Insert Company
  const { data: newCompany, error: companyError } = await supabase
    .from('consulting_companies')
    .insert(insertData)
    .select()
    .single()

  if (companyError) {
    console.error('Error creating company:', companyError)
    throw new Error(`Fehler beim Erstellen: ${companyError.message}`)
  }

  // Insert Specializations (wenn vorhanden)
  if (specialization_ids && specialization_ids.length > 0) {
    const companySpecializations = specialization_ids.map(specId => ({
      company_id: newCompany.id,
      specialization_id: specId,
    }))

    const { error: specError } = await supabase
      .from('company_specializations')
      .insert(companySpecializations)

    if (specError) {
      console.error('Error adding specializations:', specError)
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true, company: newCompany }
}

// ============================================
// UPDATE COMPANY
// ============================================
export async function updateSupabaseCompany(id: string, updateData: CompanyUpdate & { specialization_ids?: string[] }) {
  const supabase = await createClient()

  // Extrahiere specialization_ids
  const { specialization_ids, ...companyUpdate } = updateData

  const { error } = await supabase
    .from('consulting_companies')
    .update(companyUpdate)
    .eq('id', id)

  if (error) {
    console.error('Error updating company:', error)
    throw new Error(`Fehler beim Aktualisieren: ${error.message}`)
  }

  // Update Specializations
  if (specialization_ids !== undefined) {
    // Lösche alte Spezialisierungen
    await supabase
      .from('company_specializations')
      .delete()
      .eq('company_id', id)

    // Füge neue hinzu
    if (specialization_ids.length > 0) {
      const companySpecializations = specialization_ids.map(specId => ({
        company_id: id,
        specialization_id: specId,
      }))

      await supabase
        .from('company_specializations')
        .insert(companySpecializations)
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}

// ============================================
// DELETE COMPANY
// ============================================
export async function deleteSupabaseCompany(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('consulting_companies')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting company:', error)
    throw new Error(`Fehler beim Löschen: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}

// ============================================
// STATISTICS
// ============================================
export async function getSupabaseStats() {
  const supabase = await createClient()

  // Total Companies
  const { count: totalCompanies } = await supabase
    .from('consulting_companies')
    .select('*', { count: 'exact', head: true })

  // Companies per City
  const { data: citiesData } = await supabase
    .from('consulting_companies')
    .select('city')

  const citiesCount = citiesData?.reduce((acc, { city }) => {
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Specializations Count
  const { data: specData } = await supabase
    .from('company_specializations')
    .select(`
      specialization_id,
      specializations (name, icon)
    `)

  const specializationsCount = specData?.reduce((acc, item) => {
    const spec = item.specializations as any
    const key = spec.name
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return {
    totalCompanies: totalCompanies || 0,
    citiesCount,
    specializationsCount,
  }
}



