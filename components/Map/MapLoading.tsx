export default function MapLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Karte wird geladen...</p>
        <p className="text-sm text-gray-500 mt-2">
          Bitte warten, Leaflet-Komponenten werden initialisiert
        </p>
      </div>
    </div>
  )
}

