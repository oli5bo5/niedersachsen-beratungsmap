# 🚀 Quick Start Guide

## Lokale Entwicklung starten (3 Schritte)

### 1. Dependencies installieren

```bash
cd niedersachsen-beratungsmap
npm install
```

### 2. Environment Variables konfigurieren

Erstelle eine `.env.local` Datei oder bearbeite die existierende:

```bash
# Für lokale Entwicklung ohne Supabase (nur Frontend-Test):
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
```

**Für echte Daten:** Folge den Anweisungen in `DEPLOYMENT.md` um ein Supabase-Projekt zu erstellen.

### 3. Niedersachsen GeoJSON herunterladen

```bash
npm run download-map
```

Dies lädt die Niedersachsen-Kartendaten herunter (~100 KB).

### 4. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

---

## 📁 Wichtige Dateien

| Datei/Ordner | Beschreibung |
|--------------|--------------|
| `app/page.tsx` | Hauptseite mit Karte |
| `app/admin/page.tsx` | Admin-Panel |
| `components/Map/` | Karten-Komponenten |
| `components/Sidebar/` | Sidebar mit Firmen-Liste |
| `lib/supabase/` | Supabase Client & Types |
| `app/actions/companies.ts` | Server Actions (CRUD) |
| `supabase/migrations/` | Datenbank-Schema |

---

## 🎯 Features testen

### Karte anzeigen
- Öffne `http://localhost:3000`
- Die Karte zeigt Niedersachsen mit Grenzen
- (Ohne Supabase-Daten werden keine Marker angezeigt)

### Admin-Panel
- Öffne `http://localhost:3000/admin`
- Formular zum Hinzufügen von Unternehmen
- Geocoding-Funktion testen

### Export-Funktionen
- Klicke auf "Exportieren" im Header
- Wähle CSV, GeoJSON oder PDF
- Download startet automatisch

---

## 🔧 Troubleshooting

### Error: "Module not found: Can't resolve 'leaflet'"

```bash
npm install leaflet react-leaflet --force
```

### Karte lädt nicht / bleibt weiß

1. Überprüfe Browser-Konsole (F12)
2. Stelle sicher, dass `public/maps/niedersachsen.geojson` existiert
3. Führe `npm run download-map` erneut aus

### "Missing Supabase environment variables"

- Erstelle `.env.local` mit Platzhalter-Werten (siehe oben)
- Für Produktion: Folge `DEPLOYMENT.md`

---

## 📦 Production Build testen

```bash
npm run build
npm start
```

---

## 🌐 Deployment

Siehe vollständige Anleitung in `DEPLOYMENT.md`

**Kurzfassung:**
1. Supabase Projekt erstellen
2. SQL-Schema ausführen
3. GitHub Repository erstellen
4. Vercel verbinden
5. Environment Variables setzen
6. Deploy! 🚀

---

## 📞 Hilfe benötigt?

- **Logs prüfen:** Browser-Konsole (F12)
- **Deployment:** Siehe `DEPLOYMENT.md`
- **Datenbank:** SQL-Schema in `supabase/migrations/`

