import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Niedersachsen Beratungsunternehmen Map',
  description: 'Interaktive Karte der Digitalisierungs- und Beratungsunternehmen in Niedersachsen',
  keywords: ['Niedersachsen', 'Beratung', 'Digitalisierung', 'KI', 'Cloud', 'Cybersecurity'],
  authors: [{ name: 'Niedersachsen Beratungsmap' }],
  openGraph: {
    title: 'Niedersachsen Beratungsunternehmen Map',
    description: 'Interaktive Karte der Digitalisierungs- und Beratungsunternehmen in Niedersachsen',
    type: 'website',
    locale: 'de_DE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗺️</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

