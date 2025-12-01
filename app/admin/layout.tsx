import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-frameio-bg-secondary">
      {/* Back Navigation */}
      <div className="bg-frameio-bg-primary border-b border-frameio-border">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-frameio-text-secondary hover:text-frameio-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Karte
          </Link>
        </div>
      </div>
      
      {children}
    </div>
  )
}



