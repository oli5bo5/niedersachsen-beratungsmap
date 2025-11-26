'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/client'
import type { CompanyWithSpecializations, CompanyInput, Specialization } from '@/lib/supabase/types'

/**
 * Get all companies with their specializations
 */
export async function getCompanies(): Promise<CompanyWithSpecializations[]> {
  try {
    const supabase = createServerClient()

    // Fetch all companies
    const { data: companies, error: companiesError } = await supabase
      .from('consulting_companies')
      .select('*')
      .order('created_at', { ascending: false })

    if (companiesError) throw companiesError

    if (!companies || companies.length === 0) {
      return []
    }

    // Fetch specializations for all companies
    const companyIds = companies.map(c => c.id)
    const { data: companySpecs, error: specsError } = await supabase
      .from('company_specializations')
      .select(`
        company_id,
        specializations (
          id,
          name,
          icon,
          color
        )
      `)
      .in('company_id', companyIds)

    if (specsError) throw specsError

    // Map specializations to companies
    const companiesWithSpecs: CompanyWithSpecializations[] = companies.map(company => ({
      ...company,
      specializations: companySpecs
        ?.filter(cs => cs.company_id === company.id)
        .map(cs => cs.specializations as unknown as Specialization)
        .filter(Boolean) || []
    }))

    return companiesWithSpecs
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw new Error('Failed to fetch companies')
  }
}

/**
 * Get all specializations
 */
export async function getSpecializations(): Promise<Specialization[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('specializations')
      .select('*')
      .order('name')

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching specializations:', error)
    throw new Error('Failed to fetch specializations')
  }
}

/**
 * Create a new company
 */
export async function createCompany(input: CompanyInput): Promise<CompanyWithSpecializations> {
  try {
    const supabase = createServerClient()

    // Insert company
    const { data: company, error: companyError } = await supabase
      .from('consulting_companies')
      .insert({
        name: input.name,
        description: input.description,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        website: input.website,
        email: input.email,
        phone: input.phone,
      })
      .select()
      .single()

    if (companyError) throw companyError

    // Insert company specializations
    if (input.specialization_ids.length > 0) {
      const specializationInserts = input.specialization_ids.map(spec_id => ({
        company_id: company.id,
        specialization_id: spec_id,
      }))

      const { error: specsError } = await supabase
        .from('company_specializations')
        .insert(specializationInserts)

      if (specsError) throw specsError
    }

    // Fetch specializations for the new company
    const { data: specs, error: fetchSpecsError } = await supabase
      .from('company_specializations')
      .select(`
        specializations (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('company_id', company.id)

    if (fetchSpecsError) throw fetchSpecsError

    const specializations = specs?.map(s => s.specializations as unknown as Specialization).filter(Boolean) || []

    revalidatePath('/')
    revalidatePath('/admin')

    return {
      ...company,
      specializations,
    }
  } catch (error) {
    console.error('Error creating company:', error)
    throw new Error('Failed to create company')
  }
}

/**
 * Update an existing company
 */
export async function updateCompany(
  id: string,
  input: Partial<CompanyInput>
): Promise<CompanyWithSpecializations> {
  try {
    const supabase = createServerClient()

    // Update company
    const { data: company, error: companyError } = await supabase
      .from('consulting_companies')
      .update({
        name: input.name,
        description: input.description,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        website: input.website,
        email: input.email,
        phone: input.phone,
      })
      .eq('id', id)
      .select()
      .single()

    if (companyError) throw companyError

    // Update specializations if provided
    if (input.specialization_ids) {
      // Delete existing specializations
      const { error: deleteError } = await supabase
        .from('company_specializations')
        .delete()
        .eq('company_id', id)

      if (deleteError) throw deleteError

      // Insert new specializations
      if (input.specialization_ids.length > 0) {
        const specializationInserts = input.specialization_ids.map(spec_id => ({
          company_id: id,
          specialization_id: spec_id,
        }))

        const { error: insertError } = await supabase
          .from('company_specializations')
          .insert(specializationInserts)

        if (insertError) throw insertError
      }
    }

    // Fetch updated specializations
    const { data: specs, error: fetchSpecsError } = await supabase
      .from('company_specializations')
      .select(`
        specializations (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('company_id', id)

    if (fetchSpecsError) throw fetchSpecsError

    const specializations = specs?.map(s => s.specializations as unknown as Specialization).filter(Boolean) || []

    revalidatePath('/')
    revalidatePath('/admin')

    return {
      ...company,
      specializations,
    }
  } catch (error) {
    console.error('Error updating company:', error)
    throw new Error('Failed to update company')
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string): Promise<void> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('consulting_companies')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error deleting company:', error)
    throw new Error('Failed to delete company')
  }
}

