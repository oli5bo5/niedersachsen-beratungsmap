export const MAP_CONFIG = {
  clustering: {
    enabled: true,
    maxClusterRadius: 60,
    disableClusteringAtZoom: 15,
    spiderfyDistanceMultiplier: 1.5,
    chunkedLoading: true,
    animate: true,
    animateAddingMarkers: true,
  },
  performance: {
    preferCanvas: true, // Verwende Canvas statt SVG für bessere Performance
    updateWhenIdle: false,
    updateWhenZooming: false,
    keepBuffer: 2,
  },
  defaults: {
    zoom: 7.5,
    minZoom: 6,
    maxZoom: 18,
    center: [52.3759, 9.732] as [number, number], // Hannover
  }
}



