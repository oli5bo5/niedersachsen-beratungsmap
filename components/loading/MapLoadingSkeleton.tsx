'use client'

import { motion } from 'framer-motion'
import { Map, MapPin, Building2 } from 'lucide-react'

export default function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center 
                    bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="text-center space-y-8 max-w-md">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="relative w-24 h-24 mx-auto"
        >
          {/* Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 
                       rounded-3xl blur-2xl"
          />
          
          {/* Main Icon */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 
                          rounded-3xl flex items-center justify-center
                          shadow-[0_20px_50px_rgba(99,102,241,0.3)]">
            <Map className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating Icons */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4 w-10 h-10 bg-white 
                       rounded-2xl flex items-center justify-center
                       shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <Building2 className="w-5 h-5 text-indigo-500" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [10, -10, 10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -bottom-4 -left-4 w-10 h-10 bg-white 
                       rounded-2xl flex items-center justify-center
                       shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <MapPin className="w-5 h-5 text-purple-500" />
          </motion.div>
        </motion.div>
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            Lade Karte
          </h2>
          <p className="text-muted-foreground">
            Niedersachsen wird geladen...
          </p>
        </motion.div>
        
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          ))}
        </div>
      </div>
    </div>
  )
}



