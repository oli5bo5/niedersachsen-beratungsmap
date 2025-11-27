/**
 * Leaflet configuration and icon fixes for Next.js/Webpack
 */

import L from 'leaflet'

// Fix for default marker icons not loading correctly in Next.js
export function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

/**
 * Frame.io Marker Colors
 */
export const FRAMEIO_MARKER_COLORS = {
  primary: '#4F46E5',      // Indigo-600
  secondary: '#A855F7',    // Purple-500
  accent: '#3B82F6',       // Blue-500
  success: '#10B981',      // Green-500
}

/**
 * Create a Frame.io styled marker icon
 */
export function createColoredIcon(color: string, icon?: string) {
  return L.divIcon({
    className: 'custom-frameio-marker',
    html: `
      <div class="relative group cursor-pointer" style="width: 44px; height: 44px;">
        
        <!-- Glow Effect -->
        <div class="absolute inset-0 rounded-full blur-xl opacity-0 
                    group-hover:opacity-60 transition-opacity duration-300"
             style="background: ${color};"></div>
        
        <!-- Main Circle -->
        <div class="relative w-full h-full rounded-full 
                    bg-white
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300"
             style="border: 4px solid ${color}; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          
          <!-- Inner Dot -->
          <div class="w-4 h-4 rounded-full" 
               style="background: ${color};"></div>
        </div>
        
        <!-- Pulse Animation -->
        <div class="absolute inset-0 rounded-full animate-ping opacity-20"
             style="background: ${color}; animation-duration: 2s;"></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  })
}



