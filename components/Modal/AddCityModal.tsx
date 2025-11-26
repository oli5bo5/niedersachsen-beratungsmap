'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCity } from '@/app/actions/cities'
import { geocodeAddress } from '@/lib/geocoding'
import { CITY_CATEGORIES } from '@/lib/types/city'

const citySchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  population: z
    .number()
    .int()
    .min(0, 'Einwohnerzahl kann nicht negativ sein')
    .max(10000000, 'Einwohnerzahl zu hoch')
    .optional()
    .or(z.literal(0)),
  digitalization_budget: z
    .number()
    .min(0, 'Budget kann nicht negativ sein')
    .max(1000000000, 'Budget zu hoch')
    .optional()
    .or(z.literal(0)),
  city_category: z.enum(['Großstadt', 'Mittelstadt', 'Kleinstadt']).optional(),
  description: z.string().optional(),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
  specializations: z.array(z.string()).optional(),
})

type CityFormData = z.infer<typeof citySchema>

interface AddCityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Available specializations
const AVAILABLE_SPECIALIZATIONS = [
  { name: 'Cloud-Migration', icon: '☁️' },
  { name: 'Cybersecurity', icon: '🔒' },
  { name: 'Digitalisierung', icon: '📱' },
  { name: 'KI-Beratung', icon: '🤖' },
  { name: 'Prozessoptimierung', icon: '⚙️' },
]

export default function AddCityModal({ isOpen, onClose, onSuccess }: AddCityModalProps) {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
      population: 0,
      digitalization_budget: 0,
      city_category: 'Kleinstadt',
    },
  })

  const cityName = watch('name')
  const population = watch('population')

  // Automatische Kategorisierung (nur wenn Einwohnerzahl > 0)
  const handlePopulationChange = (pop: number) => {
    if (pop > 0) {
      if (pop >= 100000) {
        setValue('city_category', 'Großstadt')
      } else if (pop >= 20000) {
        setValue('city_category', 'Mittelstadt')
      } else {
        setValue('city_category', 'Kleinstadt')
      }
    } else {
      // Keine Einwohnerzahl: Default Kleinstadt
      setValue('city_category', 'Kleinstadt')
    }
  }

  const handleGeocode = async () => {
    if (!cityName) {
      setStatusMessage({ type: 'error', text: 'Bitte Stadtnamen eingeben' })
      return
    }

    setIsGeocoding(true)
    setStatusMessage(null)

    try {
      const address = `${cityName}, Niedersachsen, Deutschland`
      const coords = await geocodeAddress(address)
      setCoordinates(coords)
      setStatusMessage({
        type: 'success',
        text: `✓ Koordinaten: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      })
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Geocoding fehlgeschlagen',
      })
      setCoordinates(null)
    } finally {
      setIsGeocoding(false)
    }
  }

  const onSubmit = async (data: CityFormData) => {
    if (!coordinates) {
      setStatusMessage({ type: 'error', text: 'Bitte zuerst Stadt geocodieren' })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      // Prepare data with defaults for optional fields
      const cityData = {
        name: data.name,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        population: data.population || 0,
        digitalization_budget: data.digitalization_budget || 0,
        city_category: data.city_category || 'Kleinstadt',
        description: data.description,
        website: data.website,
        specializations: data.specializations || [],
      }

      await createCity(cityData)

      setStatusMessage({ type: 'success', text: '✅ Stadt erfolgreich hinzugefügt!' })
      
      // Reset form and close modal after short delay
      setTimeout(() => {
        reset()
        setCoordinates(null)
        setStatusMessage(null)
        onClose()
        onSuccess?.()
      }, 1500)
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Fehler beim Speichern',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setCoordinates(null)
    setStatusMessage(null)
    onClose()
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🏙️ Neue Stadt hinzufügen
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Stadtname mit Geocoding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stadtname <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  {...register('name')}
                  type="text"
                  placeholder="z.B. Emden"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={isGeocoding || !cityName}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isGeocoding ? '⏳' : '📍'} Geocode
                </button>
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Einwohnerzahl */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👥 Einwohnerzahl <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                {...register('population', {
                  valueAsNumber: true,
                  onChange: (e) => handlePopulationChange(parseInt(e.target.value) || 0),
                })}
                type="number"
                step="1000"
                placeholder="z.B. 50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(population ?? 0) > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  {formatNumber(population ?? 0)} Einwohner
                </p>
              )}
              {errors.population && (
                <p className="text-red-500 text-xs mt-1">{errors.population.message}</p>
              )}
            </div>

            {/* Digitalisierungsbudget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💶 Digitalisierungsbudget <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                {...register('digitalization_budget', { valueAsNumber: true })}
                type="number"
                step="100000"
                placeholder="z.B. 1000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {watch('digitalization_budget') && watch('digitalization_budget')! > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  {formatCurrency(watch('digitalization_budget')!)}
                </p>
              )}
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stadt-Kategorie <span className="text-gray-500 text-xs">(wird automatisch gesetzt)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
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
                    <span className="text-xl mb-1">
                      {category === 'Großstadt' && '🏙️'}
                      {category === 'Mittelstadt' && '🏘️'}
                      {category === 'Kleinstadt' && '🏡'}
                    </span>
                    <span className="text-xs font-medium text-gray-700">{category}</span>
                    <span className="text-xs text-gray-500">
                      {category === 'Großstadt' && '> 100k'}
                      {category === 'Mittelstadt' && '20-100k'}
                      {category === 'Kleinstadt' && '< 20k'}
                    </span>
                  </label>
                ))}
              </div>
              {(population ?? 0) === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  💡 Tipp: Geben Sie eine Einwohnerzahl ein, um die Kategorie automatisch zu setzen
                </p>
              )}
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={2}
                placeholder="Besonderheiten der Stadt..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                {...register('website')}
                type="url"
                placeholder="https://www.stadtname.de"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Spezialisierungen <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_SPECIALIZATIONS.map((spec) => (
                  <label
                    key={spec.name}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={spec.name}
                      {...register('specializations')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-lg">{spec.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{spec.name}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                💡 Wählen Sie die Bereiche, in denen die Stadt besondere Stärken hat
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !coordinates}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '⏳ Wird gespeichert...' : '✓ Stadt hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

