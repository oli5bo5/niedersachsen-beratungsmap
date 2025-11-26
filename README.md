# Niedersachsen Beratungsunternehmen Map

Eine interaktive Karte zur Visualisierung von Beratungsunternehmen in Niedersachsen mit Fokus auf Digitalisierung, KI, Cloud-Migration und weitere Spezialisierungen.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **Karte:** React Leaflet (Open Source)
- **Datenbank:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Features

- ✅ Interaktive Leaflet-Karte mit Niedersachsen-Grenze
- ✅ Dynamische Marker für Beratungsunternehmen
- ✅ Filter nach Spezialisierungen
- ✅ Suchfunktion
- ✅ Admin-Panel zum Hinzufügen/Bearbeiten von Firmen
- ✅ Geocoding-Integration (Adresse → Koordinaten)
- ✅ Export-Funktionen (CSV, GeoJSON, PDF)
- ✅ Map Clustering bei vielen Markern
- ✅ Responsive Design (Desktop & Mobile)

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Erstelle eine `.env.local` Datei basierend auf `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Supabase Setup

1. Erstelle ein neues Supabase Projekt
2. Führe das SQL-Schema aus: `supabase/migrations/001_initial_schema.sql`
3. Kopiere die URL und den Anon Key in `.env.local`

### 4. Niedersachsen GeoJSON herunterladen

```bash
npm run download-map
```

### 5. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur

```
niedersachsen-beratungsmap/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main Page
│   ├── layout.tsx           # Root Layout
│   ├── admin/               # Admin Panel
│   ├── api/                 # API Routes
│   └── actions/             # Server Actions
├── components/              # React Components
│   ├── Map/                 # Leaflet Map Components
│   ├── Sidebar/             # Sidebar Components
│   ├── Admin/               # Admin Components
│   └── Export/              # Export Components
├── lib/                     # Utilities & Helpers
│   ├── supabase/            # Supabase Client & Types
│   └── export/              # Export Functions
├── hooks/                   # Custom React Hooks
├── public/                  # Static Assets
│   └── maps/                # GeoJSON Files
└── supabase/                # Database Migrations
```

## Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Deployment-Anweisungen.

## License

MIT

