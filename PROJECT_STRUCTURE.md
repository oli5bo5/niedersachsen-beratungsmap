# 📁 Projektstruktur

```
niedersachsen-beratungsmap/
├── 📱 app/                          # Next.js App Router
│   ├── page.tsx                    # 🏠 Hauptseite (Karte + Sidebar)
│   ├── layout.tsx                  # Root Layout
│   ├── globals.css                 # Globale Styles + Leaflet CSS
│   │
│   ├── 👨‍💼 admin/
│   │   └── page.tsx                # Admin Panel (Firmen verwalten)
│   │
│   ├── 🔌 api/
│   │   └── geocode/
│   │       └── route.ts            # Geocoding API Endpoint
│   │
│   └── ⚡ actions/
│       └── companies.ts            # Server Actions (CRUD Operations)
│
├── 🧩 components/                   # React Komponenten
│   ├── 🗺️ Map/
│   │   ├── MapComponent.tsx        # Basis Leaflet Map
│   │   ├── MapWithClustering.tsx   # Map mit Marker-Clustering
│   │   ├── CustomMarker.tsx        # Custom Marker mit Popups
│   │   └── MapLoading.tsx          # Loading Skeleton für Map
│   │
│   ├── 📋 Sidebar/
│   │   ├── CompanyList.tsx         # Firmen-Liste mit Suche
│   │   └── FilterPanel.tsx         # Filter UI (Spezialisierungen)
│   │
│   ├── 👨‍💼 Admin/
│   │   └── AddCompanyForm.tsx      # Formular (+ Geocoding)
│   │
│   ├── 📥 Export/
│   │   └── ExportButton.tsx        # Export Dropdown (CSV/GeoJSON/PDF)
│   │
│   └── 🎨 ui/
│       ├── LoadingSkeleton.tsx     # Loading States
│       ├── ErrorBoundary.tsx       # Error Handling
│       ├── badge.tsx               # Badge Component
│       └── button.tsx              # Button Component
│
├── 🪝 hooks/                        # Custom React Hooks
│   └── useCompanyFilters.ts        # Filter & Sort Logik
│
├── 📚 lib/                          # Utilities & Helpers
│   ├── 🗄️ supabase/
│   │   ├── client.ts               # Browser & Server Clients
│   │   ├── types.ts                # TypeScript Interfaces
│   │   └── database.types.ts       # Generierte DB Types
│   │
│   ├── 📥 export/
│   │   ├── exportToCSV.ts          # CSV Export
│   │   ├── exportToGeoJSON.ts      # GeoJSON Export
│   │   └── exportToPDF.ts          # PDF Export (jsPDF)
│   │
│   ├── geocoding.ts                # Nominatim API Wrapper
│   ├── leaflet-config.ts           # Leaflet Icon Fix
│   └── performance.ts              # Debounce, Throttle, Memoize
│
├── 🗃️ supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Datenbank-Schema + Seeds
│
├── 🗂️ public/
│   └── maps/
│       ├── .gitkeep
│       └── niedersachsen.geojson   # (nach npm run download-map)
│
├── 📜 scripts/
│   └── download-map.js             # GeoJSON Download Script
│
├── ⚙️ Konfigurationsdateien
│   ├── package.json                # Dependencies & Scripts
│   ├── tsconfig.json               # TypeScript Config (strict mode)
│   ├── next.config.js              # Next.js Config (optimiert)
│   ├── tailwind.config.ts          # Tailwind Theme
│   ├── postcss.config.js           # PostCSS Config
│   ├── .eslintrc.json              # ESLint Rules
│   ├── .gitignore                  # Git Ignore
│   ├── vercel.json                 # Vercel Deployment
│   ├── .vercelignore               # Vercel Ignore
│   ├── middleware.ts               # Auth Middleware (Admin)
│   └── .env.local.example          # Environment Template
│
└── 📖 Dokumentation
    ├── README.md                   # Projekt-Übersicht
    ├── QUICK_START.md              # Schnellstart-Anleitung
    ├── DEPLOYMENT.md               # Deployment Guide
    └── PROJECT_STRUCTURE.md        # Diese Datei
```

---

## 🎯 Hauptkomponenten Übersicht

### 🏠 Main Page (`app/page.tsx`)
- **Layout:** Header + Sidebar (30%) + Map (70%)
- **State Management:** `selectedCompanyId` Sync zwischen Sidebar und Map
- **Data Loading:** Server-Side mit `getCompanies()` und `getSpecializations()`
- **Features:** Export-Button im Header

### 🗺️ Map Component (`components/Map/MapWithClustering.tsx`)
- **Library:** React Leaflet
- **Features:**
  - Niedersachsen-Grenze als GeoJSON Overlay
  - Custom Marker mit Farben basierend auf Spezialisierung
  - Marker Clustering (bei > 20 Firmen)
  - Click-to-Zoom auf Firma
  - Dynamic Import (Client-Side Only)
- **Tiles:** OpenStreetMap (kostenlos)

### 📋 Sidebar (`components/Sidebar/CompanyList.tsx`)
- **Search:** Debounced (300ms)
- **Filter:** Multi-Select Spezialisierungen
- **Sort:** Alphabetisch, Neueste, Nächste
- **Mobile:** Toggle Button (Slide-In Animation)
- **Responsive:** Fixed auf Mobile, Sticky auf Desktop

### 👨‍💼 Admin Panel (`app/admin/page.tsx`)
- **Form:** React Hook Form + Zod Validierung
- **Geocoding:** Nominatim API (Adresse → Koordinaten)
- **Preview:** Live Map mit neuem Marker
- **Table:** Alle Firmen mit Edit/Delete
- **Protected:** Middleware (aktuell: dev-only)

### 📥 Export System (`lib/export/`)
- **CSV:** Excel-kompatibel, UTF-8 BOM
- **GeoJSON:** Für QGIS, ArcGIS, etc.
- **PDF:** jsPDF, mehrseitig, formatiert

---

## 🔄 Datenfluss

```
1. User öffnet Seite
   └─> Server Component lädt Daten (getCompanies)
       └─> Supabase Query mit JOINs
           └─> Props an Client Components

2. User wählt Firma aus Sidebar
   └─> setState(selectedCompanyId)
       └─> Map zoomt zu Koordinaten (flyTo)

3. User filtert Spezialisierungen
   └─> useCompanyFilters Hook
       └─> useMemo berechnet gefilterte Liste
           └─> Re-render von List & Map

4. Admin fügt Firma hinzu
   └─> Form Submit
       └─> Geocoding API (Adresse → Koordinaten)
           └─> Server Action: createCompany()
               └─> Supabase INSERT (Transaction)
                   └─> revalidatePath('/') & '/admin'
                       └─> UI Update (optimistic)
```

---

## 🔐 Authentifizierung

**Aktueller Stand:**
- Admin-Route: Middleware vorbereitet, aber offen (Development)
- RLS in Supabase: Lesen = Public, Schreiben = Authenticated

**Für Produktion:**
1. Supabase Auth aktivieren (Email/Password)
2. Login-Page erstellen (`app/login/page.tsx`)
3. Middleware anpassen (Redirect bei no session)
4. Logout-Button im Admin-Panel

---

## 🚀 Performance-Optimierungen

### ✅ Implementiert
- Dynamic Imports (Leaflet nur Client-Side)
- Map Loading Skeleton
- Debounced Search (300ms)
- Marker Clustering (> 20 Marker)
- Next.js Image Optimization
- SWC Minification
- Compression aktiviert
- useMemo für Filter-Berechnungen

### 💡 Optional für Skalierung
- React Query für Caching
- Virtualisierte Liste (react-window)
- Service Worker für Offline-Support
- Edge Functions (Vercel Edge)
- Incremental Static Regeneration (ISR)

---

## 🎨 Styling-System

### Farben (CSS Custom Properties)
```css
--color-primary: #2563EB    (Blau - Niedersachsen)
--color-secondary: #10B981  (Grün)
--color-accent: #F59E0B     (Orange)
--map-border-color: #3B82F6 (Heller Blau)
```

### Tailwind Theme Extensions
- `rounded-custom`: 12px
- `duration-custom`: 200ms
- Custom Farben (primary, secondary, accent)

### Accessibility
- Focus-Visible Styles
- ARIA Labels
- Keyboard Navigation
- Prefers-Reduced-Motion Support
- High Contrast Mode Support

---

## 📊 Datenbank-Schema (Supabase)

### Tabellen
1. **consulting_companies**
   - id (UUID, PK)
   - name, description, address
   - latitude, longitude (DECIMAL)
   - website, email, phone
   - created_at, updated_at

2. **specializations**
   - id (UUID, PK)
   - name (UNIQUE)
   - icon (Emoji)
   - color (Hex)

3. **company_specializations** (Junction)
   - id (UUID, PK)
   - company_id (FK)
   - specialization_id (FK)

### RLS Policies
- SELECT: Public (alle)
- INSERT/UPDATE/DELETE: Authenticated Users

### Seeds
- 5 Spezialisierungen vorinstalliert
- Digitalisierung, KI, Cloud, Cybersecurity, Prozessoptimierung

---

## 📦 Dependencies Übersicht

### Core
- `next` 14.2.5 - Framework
- `react` 18.3.1 - UI Library
- `typescript` 5.3.3 - Type Safety

### UI & Styling
- `tailwindcss` 3.4.1 - CSS Framework
- `react-leaflet` 4.2.1 - Karten-Komponenten
- `leaflet` 1.9.4 - Karten-Library

### Data & Forms
- `@supabase/supabase-js` 2.39.3 - Datenbank Client
- `react-hook-form` 7.49.3 - Formular-Management
- `zod` 3.22.4 - Validierung

### Features
- `react-leaflet-cluster` 2.1.0 - Marker Clustering
- `jspdf` 2.5.1 - PDF Export
- `file-saver` 2.0.5 - Download Handler

---

Erstellt: November 2025
Version: 1.0.0

