import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import { geocodeAddress } from '@/lib/geocoding'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, city, address, description, email, phone, website, specializations } = body

    // Validate required fields
    if (!name || !city || !address || !email) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen: name, city, address, email' },
        { status: 400 }
      )
    }

    // Geocode address
    console.log(`Geocoding: ${address}, ${city}`)
    const fullAddress = `${address}, ${city}, Niedersachsen, Deutschland`
    const coordinates = await geocodeAddress(fullAddress)

    // Insert to database
    const supabase = createServerClient()

    const { data: company, error: companyError } = await supabase
      .from('consulting_companies')
      .insert({
        name,
        city,
        address: fullAddress,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        description: description || '',
        email,
        phone: phone || '',
        website: website || null,
      })
      .select()
      .single()

    if (companyError) {
      console.error('Database error:', companyError)
      return NextResponse.json(
        { error: 'Datenbankfehler', details: companyError.message },
        { status: 500 }
      )
    }

    // Add specializations if provided
    if (specializations && Array.isArray(specializations) && specializations.length > 0) {
      const specLinks = specializations.map((specId: string) => ({
        company_id: company.id,
        specialization_id: specId,
      }))

      const { error: specError } = await supabase
        .from('company_specializations')
        .insert(specLinks)

      if (specError) {
        console.error('Specialization link error:', specError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        company,
        message: `Unternehmen "${name}" erfolgreich hinzugefügt`,
        coordinates,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Quick-add error:', error)
    return NextResponse.json(
      {
        error: 'Interner Serverfehler',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check if API is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/companies/quick-add',
    method: 'POST',
    requiredFields: ['name', 'city', 'address', 'email'],
    optionalFields: ['description', 'phone', 'website', 'specializations'],
  })
}

