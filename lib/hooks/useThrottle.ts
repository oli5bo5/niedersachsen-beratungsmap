import { useRef, useCallback } from 'react'

/**
 * Throttle Hook - limitiert die Ausführungshäufigkeit einer Funktion
 * @param callback - Die zu throttelnde Funktion
 * @param delay - Minimaler Abstand zwischen Ausführungen in ms (default: 100ms)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  const lastRun = useRef(Date.now())

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = now
      }
    },
    [callback, delay]
  ) as T
}



