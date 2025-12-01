'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  X
} from 'lucide-react'
import { useCreateCompany, useSpecializations } from '@/lib/hooks/useCompanies'

// ============================================
// GEOCODING HELPER
// ============================================
async function geocodeAddress(city: string, address: string): Promise<{ lat: number; lng: number }> {
  const query = `${address}, ${city}, Niedersachsen, Germany`
  
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
    `format=json&q=${encodeURIComponent(query)}&limit=1`,
    {
      headers: {
        'User-Agent': 'NiedersachsenBeratungsmap/1.0'
      }
    }
  )
  
  const data = await response.json()
  
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    }
  }
  
  throw new Error('Adresse konnte nicht gefunden werden. Bitte überprüfe die Eingabe.')
}

// ============================================
// TYPES
// ============================================
interface AddCompanyFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

// ============================================
// COMPONENT
// ============================================

export default function AddCompanyForm({ onSuccess, onCancel }: AddCompanyFormProps) {
  const { data: specializations = [] } = useSpecializations()
  const createMutation = useCreateCompany()
  
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [geocoding, setGeocoding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  // Auto-Geocoding beim Eingeben von Stadt/Adresse
  const handleGeocodePreview = async (city: string, address: string) => {
    if (!city || !address) return
    
    try {
      setGeocoding(true)
      const coords = await geocodeAddress(city, address)
      setCoordinates(coords)
    } catch (error) {
      console.error('Geocoding-Vorschau fehlgeschlagen:', error)
    } finally {
      setGeocoding(false)
    }
  }

  // Form Submit Handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      // Geocodierung
      const city = formData.get('city') as string
      const address = formData.get('address') as string
      
      let coords = coordinates
      if (!coords) {
        coords = await geocodeAddress(city, address)
      }
      
      // Erstelle Company Data
      const companyData = {
        name: formData.get('name') as string,
        city,
        address,
        lat: coords.lat,
        lng: coords.lng,
        website: (formData.get('website') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        email: (formData.get('email') as string) || undefined,
        description: (formData.get('description') as string) || undefined,
        employee_count: formData.get('employee_count') ? parseInt(formData.get('employee_count') as string) : undefined,
        founded_year: formData.get('founded_year') ? parseInt(formData.get('founded_year') as string) : undefined,
        specialization_ids: selectedSpecs
      }

      // Erstelle Unternehmen mit React Query
      await createMutation.mutateAsync(companyData)
      
      setMessage({ 
        type: 'success', 
        text: '✅ Unternehmen erfolgreich hinzugefügt!' 
      })
      
      // Reset Form
      e.currentTarget.reset()
      setSelectedSpecs([])
      setCoordinates(null)
      
      // Callback
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
      })
    }
  }

  // Toggle Spezialisierung
  const toggleSpecialization = (specId: string) => {
    setSelectedSpecs(prev =>
      prev.includes(specId)
        ? prev.filter(id => id !== specId)
        : [...prev, specId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-8 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-frameio-text-primary flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-frameio-primary to-frameio-accent-purple flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            Neues Unternehmen hinzufügen
          </h2>
          <p className="text-sm text-frameio-text-secondary mt-1 ml-[52px]">
            Alle Pflichtfelder (*) müssen ausgefüllt werden
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-frameio-bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-frameio-text-secondary" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================ */}
        {/* BASIC INFO */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firmenname */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Firmenname *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
              placeholder="z.B. DigiConsult Hannover GmbH"
            />
          </div>

          {/* Stadt */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Stadt *
            </label>
            <input
              name="city"
              type="text"
              required
              className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
              placeholder="z.B. Hannover"
              onBlur={(e) => {
                const address = (document.querySelector('input[name="address"]') as HTMLInputElement)?.value
                if (e.target.value && address) {
                  handleGeocodePreview(e.target.value, address)
                }
              }}
            />
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
            Adresse *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
            <input
              name="address"
              type="text"
              required
              className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
              placeholder="z.B. Vahrenwalder Straße 7"
              onBlur={(e) => {
                const city = (document.querySelector('input[name="city"]') as HTMLInputElement)?.value
                if (e.target.value && city) {
                  handleGeocodePreview(city, e.target.value)
                }
              }}
            />
            {geocoding && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-primary animate-spin" />
            )}
          </div>
          {coordinates && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Koordinaten gefunden: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* ============================================ */}
        {/* CONTACT INFO */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
              <input
                name="website"
                type="url"
                className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
                placeholder="https://beispiel.de"
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Telefon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
              <input
                name="phone"
                type="tel"
                className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
                placeholder="+49 511 123456"
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
              <input
                name="email"
                type="email"
                className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
                placeholder="info@firma.de"
              />
            </div>
          </div>

          {/* Mitarbeiteranzahl */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Mitarbeiteranzahl
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
              <input
                name="employee_count"
                type="number"
                min="1"
                className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
                placeholder="z.B. 45"
              />
            </div>
          </div>

          {/* Gründungsjahr */}
          <div>
            <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
              Gründungsjahr
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frameio-text-secondary" />
              <input
                name="founded_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 pl-11 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all"
                placeholder="z.B. 2015"
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* DESCRIPTION */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-semibold text-frameio-text-primary mb-2">
            Beschreibung
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full bg-frameio-bg-secondary border border-frameio-border rounded-xl px-4 py-3 text-frameio-text-primary focus:outline-none focus:border-frameio-primary focus:ring-2 focus:ring-frameio-primary/20 transition-all resize-none"
            placeholder="Kurze Beschreibung des Unternehmens und seiner Leistungen..."
          />
        </div>

        {/* ============================================ */}
        {/* SPECIALIZATIONS */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-semibold text-frameio-text-primary mb-3">
            Spezialisierungen
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {specializations.map((spec) => (
              <motion.button
                key={spec.id}
                type="button"
                onClick={() => toggleSpecialization(spec.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${selectedSpecs.includes(spec.id)
                    ? 'border-frameio-primary bg-frameio-primary/5'
                    : 'border-frameio-border hover:border-frameio-primary/30'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{spec.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-frameio-text-primary">
                      {spec.name}
                    </p>
                  </div>
                  {selectedSpecs.includes(spec.id) && (
                    <CheckCircle className="w-5 h-5 text-frameio-primary" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* MESSAGE */}
        {/* ============================================ */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-4 rounded-xl flex items-center gap-3
              ${message.type === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
              }
            `}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* ============================================ */}
        {/* ACTIONS */}
        {/* ============================================ */}
        <div className="flex gap-4 pt-4">
          <motion.button
            type="submit"
            disabled={createMutation.isPending}
            whileHover={{ scale: createMutation.isPending ? 1 : 1.02 }}
            whileTap={{ scale: createMutation.isPending ? 1 : 0.98 }}
            className="bg-frameio-primary hover:bg-frameio-primary-hover text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Speichert...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Unternehmen hinzufügen
              </>
            )}
          </motion.button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={createMutation.isPending}
              className="px-6 py-3 rounded-xl border-2 border-frameio-border hover:bg-frameio-bg-secondary transition-colors disabled:opacity-50"
            >
              Abbrechen
            </button>
          )}
        </div>
      </form>
    </motion.div>
  )
}
