import { NextRequest, NextResponse } from 'next/server'
import { geocodeAddress } from '@/lib/geocoding'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const result = await geocodeAddress(address)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Geocoding API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to geocode address'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}



