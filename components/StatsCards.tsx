'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Briefcase, Users } from 'lucide-react'
import { CompanyWithSpecializations } from '@/lib/types/company'

interface StatsCardsProps {
  companies: CompanyWithSpecializations[]
}

export default function StatsCards({ companies }: StatsCardsProps) {
  const stats = useMemo(() => {
    return {
      totalCompanies: companies.length,
      uniqueCities: new Set(companies.map(c => c.city)).size,
      uniqueSpecs: new Set(
        companies.flatMap(c => 
          c.company_specializations?.map(cs => cs.specializations.id) || []
        )
      ).size,
      totalEmployees: companies.reduce((sum, c) => sum + (c.employee_count || 0), 0)
    }
  }, [companies])

  const cards = [
    {
      icon: Building2,
      value: stats.totalCompanies,
      label: 'Unternehmen',
      color: 'from-frameio-primary to-frameio-accent-purple'
    },
    {
      icon: MapPin,
      value: stats.uniqueCities,
      label: 'Städte',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      value: stats.uniqueSpecs,
      label: 'Spezialisierungen',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      value: stats.totalEmployees,
      label: 'Mitarbeiter',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-3`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-frameio-text-primary mb-1">
            {card.value.toLocaleString('de-DE')}
          </p>
          <p className="text-sm text-frameio-text-secondary">
            {card.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

