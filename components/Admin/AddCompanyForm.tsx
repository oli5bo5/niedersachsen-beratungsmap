'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Specialization } from '@/lib/supabase/types'
import { createCompany } from '@/app/actions/companies'

const companySchema = z.object({
  name: z.string().min(3, 'Name muss mindestens 3 Zeichen lang sein'),
  city: z.string().min(2, 'Stadt ist erforderlich'),
  description: z.string().min(20, 'Beschreibung muss mindestens 20 Zeichen haben'),
  address: z.string().min(5, 'Vollständige Adresse erforderlich'),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
  email: z.string().email('Gültige E-Mail erforderlich'),
  phone: z.string().min(10, 'Gültige Telefonnummer erforderlich'),
  specialization_ids: z.array(z.string()).min(1, 'Mindestens eine Spezialisierung auswählen'),
})

type CompanyFormData = z.infer<typeof companySchema>

interface AddCompanyFormProps {
  specializations: Specialization[]
  onSuccess?: () => void
}

export default function AddCompanyForm({
  specializations,
  onSuccess,
}: AddCompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  })

  const addressValue = watch('address')
  const cityValue = watch('city')

  // Geocode address
  const handleGeocode = async () => {
    if (!addressValue || !cityValue) {
      setError('Bitte geben Sie Stadt und Adresse ein')
      return
    }

    setIsGeocoding(true)
    setError(null)

    try {
      const fullAddress = `${addressValue}, ${cityValue}, Niedersachsen, Deutschland`
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: fullAddress }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Geocoding fehlgeschlagen')
      }

      const data = await response.json()
      setCoordinates({ lat: data.lat, lng: data.lng })
      setSuccess(`Koordinaten gefunden: ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Geocoding fehlgeschlagen')
    } finally {
      setIsGeocoding(false)
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Check if coordinates are set
      if (!coordinates) {
        throw new Error('Bitte geocodieren Sie die Adresse zuerst')
      }

      await createCompany({
        name: data.name,
        city: data.city,
        description: data.description,
        address: data.address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        website: data.website,
        email: data.email,
        phone: data.phone,
        specialization_ids: data.specialization_ids,
      })

      setSuccess('✅ Unternehmen erfolgreich hinzugefügt!')
      reset()
      setCoordinates(null)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Firmenname <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="z.B. Digital Pioneers Hannover"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Stadt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stadt <span className="text-red-500">*</span>
        </label>
        <input
          {...register('city')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="z.B. Hannover"
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beschreibung <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Beschreiben Sie die Dienstleistungen und Expertise des Unternehmens..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Address with Geocode Button */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Adresse <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            {...register('address')}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Straße, PLZ, Stadt"
          />
          <button
            type="button"
            onClick={handleGeocode}
            disabled={isGeocoding || !addressValue}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isGeocoding ? '⏳' : '📍'} Geocode
          </button>
        </div>
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
        {coordinates && (
          <p className="text-green-600 text-xs mt-1">
            ✓ Koordinaten: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <input
          {...register('website')}
          type="url"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">E-Mail</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="info@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Telefon</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+49 123 456789"
        />
      </div>

      {/* Specializations */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Spezialisierungen <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {specializations.map((spec) => (
            <label key={spec.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                value={spec.id}
                {...register('specialization_ids')}
                className="mr-2"
              />
              <span className="text-sm">
                {spec.icon} {spec.name}
              </span>
              <span
                className="ml-auto w-4 h-4 rounded-full"
                style={{ backgroundColor: spec.color }}
              />
            </label>
          ))}
        </div>
        {errors.specialization_ids && (
          <p className="text-red-500 text-xs mt-1">
            {errors.specialization_ids.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !coordinates}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? 'Wird erstellt...' : '✓ Unternehmen hinzufügen'}
      </button>
    </form>
  )
}

