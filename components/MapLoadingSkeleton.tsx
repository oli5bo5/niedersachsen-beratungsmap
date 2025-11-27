import { motion } from 'framer-motion'

export default function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-frameio-card rounded-2xl flex items-center justify-center overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-frameio-primary/5 to-frameio-accent-purple/5" />
      
      {/* Pulse Animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-frameio-primary to-frameio-accent-purple opacity-20"
      />

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-8 text-center"
      >
        <div className="w-12 h-12 border-4 border-frameio-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-frameio-text-primary font-medium">Lade interaktive Karte...</p>
        <p className="text-sm text-frameio-text-secondary mt-1">
          Bereite Kartendaten vor
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-frameio-primary/20 animate-ping" />
      <div className="absolute bottom-12 right-12 w-6 h-6 rounded-full bg-frameio-accent-purple/20 animate-ping" 
           style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

