'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers } from 'lucide-react'

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function MobileFilterSheet({ isOpen, onClose, children }: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] lg:hidden"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 z-[2001] 
                       bg-background rounded-t-3xl 
                       max-h-[85vh] overflow-hidden
                       shadow-[0_-10px_50px_rgba(0,0,0,0.2)]
                       lg:hidden"
          >
            {/* Handle */}
            <div className="flex justify-center py-3 border-b border-border/50">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Filter</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6 custom-scrollbar">
              {children}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-background">
              <button className="frameio-button w-full" onClick={onClose}>
                Filter anwenden
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}



