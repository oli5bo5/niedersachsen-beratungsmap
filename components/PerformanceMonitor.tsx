'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, X } from 'lucide-react'

export default function PerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const [showMonitor, setShowMonitor] = useState(false)

  useEffect(() => {
    if (!showMonitor) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [showMonitor])

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setShowMonitor(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Toggle Button */}
      {!showMonitor && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowMonitor(true)}
          className="fixed bottom-4 left-4 w-12 h-12 rounded-full bg-frameio-primary text-white shadow-lg hover:shadow-xl transition-shadow z-50"
          title="Performance Monitor (Ctrl+Shift+P)"
        >
          <Activity className="w-6 h-6 mx-auto" />
        </motion.button>
      )}

      {/* Monitor Panel */}
      <AnimatePresence>
        {showMonitor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 bg-frameio-bg-primary border border-frameio-border rounded-2xl shadow-2xl p-4 z-50 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-frameio-primary" />
                <h3 className="font-semibold text-frameio-text-primary">Performance</h3>
              </div>
              <button
                onClick={() => setShowMonitor(false)}
                className="p-1 hover:bg-frameio-bg-secondary rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* FPS */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-frameio-text-secondary">FPS</span>
                  <span className={`font-mono font-bold ${
                    fps >= 55 ? 'text-green-600' : 
                    fps >= 30 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {fps}
                  </span>
                </div>
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      fps >= 55 ? 'bg-green-500' : 
                      fps >= 30 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${(fps / 60) * 100}%` }}
                  />
                </div>
              </div>

              {/* Memory (wenn verfügbar) */}
              {(performance as any).memory && (
                <div className="text-xs text-frameio-text-secondary pt-2 border-t border-frameio-border">
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="font-mono">
                      {Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-frameio-text-secondary mt-3 pt-2 border-t border-frameio-border">
              Shortcut: Ctrl+Shift+P
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

