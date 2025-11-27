'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCity } from '@/app/actions/cities'
import { geocodeAddress } from '@/lib/geocoding'
import { CITY_CATEGORIES, CITY_CATEGORY_COLORS } from '@/lib/types/city'

const citySchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  population: z
    .number()
    .int()
    .min(1000, 'Einwohnerzahl muss mindestens 1.000 sein')
    .max(10000000, 'Einwohnerzahl zu hoch'),
  digitalization_budget: z
    .number()
    .min(0, 'Budget kann nicht negativ sein')
    .max(1000000000, 'Budget zu hoch'),
  city_category: z.enum(['Großstadt', 'Mittelstadt', 'Kleinstadt']),
  description: z.string().optional(),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
})

type CityFormData = z.infer<typeof citySchema>

interface Props {
  onSuccess?: () => void
}

export default function AddCityForm({ onSuccess }: Props) {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      population: 50000,
      digitalization_budget: 1000000,
      city_category: 'Mittelstadt',
    },
  })

  const cityName = watch('name')
  const population = watch('population')

  // Automatische Kategorisierung basierend auf Einwohnerzahl
  const handlePopulationChange = (pop: number) => {
    if (pop >= 100000) {
      setValue('city_category', 'Großstadt')
    } else if (pop >= 20000) {
      setValue('city_category', 'Mittelstadt')
    } else {
      setValue('city_category', 'Kleinstadt')
    }
  }

  const handleGeocode = async () => {
    if (!cityName) {
      setError('Bitte Stadtnamen eingeben')
      return
    }

    setIsGeocoding(true)
    setError(null)

    try {
      const address = `${cityName}, Niedersachsen, Deutschland`
      const coords = await geocodeAddress(address)
      setCoordinates(coords)
      setSuccess(`Koordinaten gefunden: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Geocoding fehlgeschlagen')
      setCoordinates(null)
    } finally {
      setIsGeocoding(false)
    }
  }

  const onSubmit = async (data: CityFormData) => {
    if (!coordinates) {
      setError('Bitte zuerst Stadt geocodieren')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await createCity({
        ...data,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      })

      setSuccess('✅ Stadt erfolgreich hinzugefügt!')
      reset()
      setCoordinates(null)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Neue Stadt hinzufügen</h2>

      {/* Status Messages */}
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

      {/* Stadtname mit Geocoding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stadtname <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            {...register('name')}
            type="text"
            placeholder="z.B. Lüneburg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleGeocode}
            disabled={isGeocoding || !cityName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isGeocoding ? '⏳' : '📍'} Geocode
          </button>
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        {coordinates && (
          <p className="text-green-600 text-xs mt-1">
            ✓ Koordinaten: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Einwohnerzahl */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          👥 Einwohnerzahl <span className="text-red-500">*</span>
        </label>
        <input
          {...register('population', {
            valueAsNumber: true,
            onChange: (e) => handlePopulationChange(parseInt(e.target.value) || 0),
          })}
          type="number"
          step="1000"
          placeholder="50000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {population > 0 && (
          <p className="mt-1 text-sm text-gray-600">Format: {formatNumber(population)} Einwohner</p>
        )}
        {errors.population && (
          <p className="text-red-500 text-xs mt-1">{errors.population.message}</p>
        )}
      </div>

      {/* Digitalisierungsbudget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💶 Digitalisierungsbudget (pro Jahr) <span className="text-red-500">*</span>
        </label>
        <input
          {...register('digitalization_budget', { valueAsNumber: true })}
          type="number"
          step="100000"
          placeholder="1000000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {watch('digitalization_budget') > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            Format: {formatCurrency(watch('digitalization_budget'))}
          </p>
        )}
        {errors.digitalization_budget && (
          <p className="text-red-500 text-xs mt-1">{errors.digitalization_budget.message}</p>
        )}
      </div>

      {/* Kategorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Stadt-Kategorie <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CITY_CATEGORIES.map((category) => (
            <label
              key={category}
              className={`
                flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                ${
                  watch('city_category') === category
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                value={category}
                {...register('city_category')}
                className="sr-only"
              />
              <span className="text-2xl mb-1">
                {category === 'Großstadt' && '🏙️'}
                {category === 'Mittelstadt' && '🏘️'}
                {category === 'Kleinstadt' && '🏡'}
              </span>
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <span className="text-xs text-gray-500">
                {category === 'Großstadt' && '> 100k'}
                {category === 'Mittelstadt' && '20-100k'}
                {category === 'Kleinstadt' && '< 20k'}
              </span>
            </label>
          ))}
        </div>
        {errors.city_category && (
          <p className="text-red-500 text-xs mt-1">{errors.city_category.message}</p>
        )}
      </div>

      {/* Beschreibung */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Besonderheiten der Stadt im Bereich Digitalisierung..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <input
          {...register('website')}
          type="url"
          placeholder="https://www.stadtname.de"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !coordinates}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? 'Wird gespeichert...' : '✓ Stadt hinzufügen'}
      </button>
    </form>
  )
}



