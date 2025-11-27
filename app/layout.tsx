import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
})

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
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗺️</text></svg>" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}

