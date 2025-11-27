'use client'

import { motion } from 'framer-motion'
import { MapPin, Heart, Eye, ArrowRight, ExternalLink } from 'lucide-react'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

interface CompanyCardProps {
  company: CompanyWithSpecializations
  onShowOnMap?: (companyId: string) => void
  onFavorite?: (companyId: string) => void
  isFavorite?: boolean
}

export default function CompanyCard({ 
  company, 
  onShowOnMap,
  onFavorite,
  isFavorite = false 
}: CompanyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="frameio-card group cursor-pointer relative overflow-hidden"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-4">
        {/* Company Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar with Gradient */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 
                            flex items-center justify-center text-white text-xl font-bold 
                            shadow-[0_8px_20px_rgba(99,102,241,0.3)] flex-shrink-0">
              {company.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold group-hover:gradient-text transition-all duration-300 truncate">
                {company.name}
              </h3>
              {company.city && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {company.city}
                </p>
              )}
            </div>
          </div>
          
          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite(company.id)
              }}
              className="p-2 rounded-xl hover:bg-secondary/50 transition-colors flex-shrink-0"
            >
              <Heart 
                className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
              />
            </button>
          )}
        </div>
        
        {/* Description */}
        {company.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {company.description}
          </p>
        )}
        
        {/* Specializations */}
        {company.specializations && company.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {company.specializations.slice(0, 3).map(spec => (
              <span 
                key={spec.id}
                className="frameio-badge"
              >
                <span className="text-base mr-1">{spec.icon}</span>
                {spec.name}
              </span>
            ))}
            {company.specializations.length > 3 && (
              <span className="frameio-badge">
                +{company.specializations.length - 3} mehr
              </span>
            )}
          </div>
        )}
        
        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-muted-foreground hover:text-foreground 
                       flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Website
            </a>
          )}
          
          {onShowOnMap && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onShowOnMap(company.id)
              }}
              className="text-sm font-medium text-primary flex items-center gap-2 
                       hover:gap-3 transition-all group/btn"
            >
              Auf Karte zeigen
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
