'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, 
  Building2, 
  MapPin, 
  Search, 
  Menu, 
  X,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Maximize2
} from 'lucide-react'
import MapLoadingSkeleton from '@/components/loading/MapLoadingSkeleton'
import { ThemeToggle } from '@/components/theme-toggle'

const MapComponent = dynamic(
  () => import('@/components/Map/MapWithClustering'),
  { 
    ssr: false,
    loading: () => <MapLoadingSkeleton />
  }
)

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 
                      bg-background/80 backdrop-blur-xl 
                      border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 
                            rounded-2xl flex items-center justify-center shadow-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Niedersachsen</h1>
              <p className="text-xs text-muted-foreground">Beratungsmap</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button className="frameio-nav-item">Karte</button>
            <button className="frameio-nav-item">Unternehmen</button>
            <button className="frameio-nav-item">Städte</button>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex frameio-card px-4 py-2 rounded-full 
                       text-sm font-medium hover:scale-105 transition-transform
                       items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Filter
            </button>
            
            <ThemeToggle />
            
            <a 
              href="/admin"
              className="hidden sm:block bg-frameio-primary hover:bg-frameio-primary-hover text-white font-semibold text-sm px-6 py-2 rounded-full shadow-lg transition-all"
            >
              Admin
            </a>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden frameio-card w-10 h-10 rounded-full 
                       flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 
                       bg-background/95 backdrop-blur-xl 
                       border-b border-border/50 md:hidden"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl
                               hover:bg-secondary/50 transition-colors font-medium">
                Karte
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl
                               hover:bg-secondary/50 transition-colors font-medium">
                Unternehmen
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl
                               hover:bg-secondary/50 transition-colors font-medium">
                Städte
              </button>
              <a 
                href="/admin"
                className="w-full bg-frameio-primary hover:bg-frameio-primary-hover text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all mt-2 text-center block"
              >
                Admin
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Map Area */}
      <main className="flex-1 pt-16">
        <div className="h-[calc(100vh-4rem)] relative">
          
          {/* Map Component */}
          <MapComponent
            companies={[]}
            allCities={[]}
            showCities={true}
          />
          
          {/* Floating Controls - Rechts */}
          <div className="absolute top-6 right-6 z-[1000] space-y-3">
            <div className="frameio-card p-2 space-y-2">
              <button className="w-10 h-10 rounded-xl hover:bg-secondary/50 
                               flex items-center justify-center transition-colors group">
                <ZoomIn className="w-5 h-5 text-muted-foreground 
                                  group-hover:text-foreground transition-colors" />
              </button>
              
              <div className="w-full h-px bg-border" />
              
              <button className="w-10 h-10 rounded-xl hover:bg-secondary/50 
                               flex items-center justify-center transition-colors group">
                <ZoomOut className="w-5 h-5 text-muted-foreground 
                                   group-hover:text-foreground transition-colors" />
              </button>
            </div>
            
            <button className="frameio-card w-10 h-10 rounded-xl
                             flex items-center justify-center
                             hover:scale-110 transition-transform">
              <Crosshair className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="frameio-card w-10 h-10 rounded-xl
                             flex items-center justify-center
                             hover:scale-110 transition-transform">
              <Maximize2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Filter Panel - Links (Desktop) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-6 left-6 z-[1000] 
                           frameio-card w-80 max-h-[calc(100vh-140px)]
                           overflow-y-auto
                           hidden lg:block p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filter</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-lg hover:bg-secondary/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                                     w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Suchen..."
                      className="frameio-input w-full pl-10"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                      Kategorien
                    </h4>
                    
                    <label className="flex items-center gap-3 p-3 rounded-xl 
                                    hover:bg-secondary/50 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Digitalisierung</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 rounded-xl 
                                    hover:bg-secondary/50 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">KI-Beratung</span>
                    </label>
                  </div>
                  
                  <button className="frameio-button w-full">
                    Anwenden
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stats Card - Unten Links */}
          <div className="absolute bottom-6 left-6 z-[1000] 
                          frameio-card p-4 hidden md:block">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">45</div>
                <div className="text-xs text-muted-foreground">Unternehmen</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Städte</div>
              </div>
            </div>
          </div>
          
          {/* Legend - Unten Rechts */}
          <div className="absolute bottom-6 right-6 z-[1000] 
                          frameio-card w-64 p-4 hidden md:block">
            <h4 className="text-sm font-semibold mb-3">Legende</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground flex-1">Unternehmen</span>
                <span className="text-xs font-medium">45</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-muted-foreground flex-1">Städte</span>
                <span className="text-xs font-medium">12</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="fixed bottom-6 right-6 z-[1000] 
                       frameio-button w-14 h-14 rounded-full 
                       shadow-[0_12px_30px_rgba(79,70,229,0.4)]
                       flex items-center justify-center
                       lg:hidden"
          >
            <Layers className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  )
}
