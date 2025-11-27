# Niedersachsen Beratungsmap

Eine interaktive Karte zur Visualisierung von Beratungsunternehmen in Niedersachsen.

## Features

- 🗺️ Interaktive Karte mit Marker Clustering
- 💼 Verwaltung von Beratungsunternehmen
- 🎨 Frame.io-inspiriertes Design
- ⚡ Performance-optimiert mit React Query
- 📱 Voll responsiv

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Database)
- React Leaflet (Maps)
- Tailwind CSS
- Framer Motion (Animations)
- React Query (Data Fetching & Caching)

## Setup

1. Clone Repository
2. `npm install`
3. Erstelle `.env.local` mit Supabase Keys
4. `npm run dev`

## Supabase Setup

Siehe `SUPABASE_SETUP.md` für detaillierte Anweisungen.

## Deployment

Deployed auf Vercel: [niedersachsen-beratungsmap.vercel.app](https://niedersachsen-beratungsmap.vercel.app)

## Performance

- Initial Load: < 2s
- Time to Interactive: < 2.5s
- 60 FPS Animations
- React Query Caching
- Marker Clustering
- Virtualized Lists

## License

MIT
