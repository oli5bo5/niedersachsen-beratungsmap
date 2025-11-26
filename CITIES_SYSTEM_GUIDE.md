# 🏙️ Städte-Verwaltungssystem - Komplette Anleitung

## ✅ Was wurde hinzugefügt:

Das System unterstützt jetzt die Verwaltung von Städten mit **3 Hauptattributen**:

1. **👥 Einwohnerzahl** - Für statistische Auswertungen
2. **💶 Digitalisierungsbudget** - Förderbudget für digitale Projekte (pro Jahr)
3. **🏙️ Stadt-Kategorie** - Großstadt (>100k), Mittelstadt (20-100k), Kleinstadt (<20k)

---

## 📋 Neue Komponenten & Features

### 1. Datenbank (Supabase)
- ✅ Neue Tabelle: `cities`
- ✅ 10 vordefinierte Städte (Hannover, Braunschweig, Oldenburg, etc.)
- ✅ RLS Policies konfiguriert
- ✅ Indexes für Performance

### 2. Admin-Panel
- ✅ Formular zum Hinzufügen neuer Städte
- ✅ Automatisches Geocoding (Stadt → Koordinaten)
- ✅ Automatische Kategorisierung basierend auf Einwohnerzahl
- ✅ Währungs- und Zahlenformatierung
- ✅ Städte-Tabelle mit Lösch-Funktion

### 3. Karten-Visualisierung
- ✅ Stadt-Marker mit unterschiedlichen Größen:
  - Großstadt: 16px (🏙️) - Rot
  - Mittelstadt: 12px (🏘️) - Orange  
  - Kleinstadt: 10px (🏡) - Grün
- ✅ Detaillierte Popups mit Statistiken
- ✅ Toggle zum Ein-/Ausblenden von Städten
- ✅ Legende auf der Karte

### 4. Main Page
- ✅ Zeigt Städte UND Unternehmen
- ✅ Statistik im Header: "X Unternehmen in Y Städten"
- ✅ Checkbox zum Filtern der Stadt-Marker

---

## 🚀 Schritt-für-Schritt: Städte-System aktivieren

### **Schritt 1: SQL-Schema ausführen (IN SUPABASE)**

Sie müssen **BEIDE** Migrations ausführen:

#### Migration 1: Unternehmen-Tabellen
```sql
-- Öffnen Sie: niedersachsen-beratungsmap/supabase/migrations/001_initial_schema.sql
-- Kopieren Sie das gesamte SQL und führen Sie es aus
```

#### Migration 2: Städte-Tabelle ⭐ **NEU!**
```sql
-- Öffnen Sie: niedersachsen-beratungsmap/supabase/migrations/002_cities_schema.sql
-- Kopieren Sie das gesamte SQL und führen Sie es aus
```

**In Supabase:**
1. SQL Editor öffnen
2. "New Query" klicken
3. SQL aus `002_cities_schema.sql` einfügen
4. "Run" klicken (F5)
5. ✅ Erfolgsmeldung: "Success. No rows returned"

**Das Schema enthält:**
- ✅ `cities` Tabelle mit allen Feldern
- ✅ 10 vordefinierte Städte (Seed-Daten)
- ✅ RLS Policies
- ✅ Indexes

---

### **Schritt 2: Vercel Re-Deploy**

Der Code wurde bereits zu GitHub gepusht. Vercel deployed automatisch:

1. Gehe zu Vercel Dashboard
2. Warte ~2 Minuten
3. Deployment ist fertig!

---

### **Schritt 3: Beispieldaten für Unternehmen laden (Optional)**

Laden Sie 6 Beispielunternehmen, die zu den Städten passen:

```bash
cd niedersachsen-beratungsmap
npm run seed
```

Das fügt hinzu:
- Digital Pioneers Hannover
- TechConsult Braunschweig
- Innovation Hub Oldenburg
- SmartBiz Solutions Osnabrück
- CyberGuard Göttingen
- AutoTech Advisors Wolfsburg

---

## 🎯 Features testen

### **1. Städte auf der Karte sehen**

1. Öffne: `https://niedersachsen-beratungsmap.vercel.app`
2. Du solltest **10 Stadt-Marker** sehen:
   - 🏙️ Großstädte (Rot): Hannover, Braunschweig
   - 🏘️ Mittelstädte (Orange): Oldenburg, Osnabrück, Göttingen, Wolfsburg, etc.
   - 🏡 Kleinstädte (Grün): Celle, Lüneburg

### **2. Stadt-Popup ansehen**

Klicke auf einen Stadt-Marker → Popup zeigt:
- Name & Kategorie
- Einwohnerzahl (formatiert)
- Digitalisierungsbudget (€ formatiert)
- Beschreibung
- Website-Link

### **3. Städte ein-/ausblenden**

Im Header findest du eine Checkbox:
- ✅ **"🏙️ Städte anzeigen"** - Toggle zum Ein-/Ausblenden

### **4. Neue Stadt hinzufügen**

1. Gehe zu `/admin`
2. Linkes Formular: "Neue Stadt hinzufügen"
3. Fülle aus:
   - **Stadtname:** z.B. "Stade"
   - Klicke **"📍 Geocode"**
   - **Einwohnerzahl:** z.B. 48.000
   - **Budget:** z.B. 2.500.000
   - **Kategorie:** Wird automatisch gesetzt (Mittelstadt)
   - **Beschreibung & Website:** Optional
4. Klicke **"✓ Stadt hinzufügen"**
5. Gehe zurück zur Hauptseite → Neuer Marker erscheint!

---

## 📊 Städte-Daten Übersicht

### Vordefinierte Städte (10):

| Stadt | Kategorie | Einwohner | Digitalbudget | Besonderheit |
|-------|-----------|-----------|---------------|--------------|
| Hannover | 🏙️ Großstadt | 545.000 | 12,5 Mio. € | Landeshauptstadt, Tech-Zentrum |
| Braunschweig | 🏙️ Großstadt | 250.000 | 8,0 Mio. € | Forschungsstandort, TU |
| Oldenburg | 🏘️ Mittelstadt | 170.000 | 5,5 Mio. € | Erneuerbare Energien |
| Osnabrück | 🏘️ Mittelstadt | 165.000 | 5,2 Mio. € | Friedensstadt, IT-Sektor |
| Göttingen | 🏘️ Mittelstadt | 120.000 | 4,8 Mio. € | Universitätsstadt, Forschung |
| Wolfsburg | 🏘️ Mittelstadt | 125.000 | 15,0 Mio. € | Automobilstadt (höchstes Budget!) |
| Hildesheim | 🏘️ Mittelstadt | 102.000 | 3,5 Mio. € | Historische Stadt |
| Salzgitter | 🏘️ Mittelstadt | 104.000 | 4,2 Mio. € | Smart City |
| Celle | 🏡 Kleinstadt | 70.000 | 2,8 Mio. € | Fachwerkstadt |
| Lüneburg | 🏡 Kleinstadt | 77.000 | 3,1 Mio. € | Nachhaltige Digitalisierung |

**Gesamt:**
- 🏙️ **2 Großstädte** (795.000 Einwohner)
- 🏘️ **6 Mittelstädte** (786.000 Einwohner)
- 🏡 **2 Kleinstädte** (147.000 Einwohner)
- **💶 Total Budget:** 69,6 Millionen Euro/Jahr

---

## 🎨 Visuelle Unterschiede

### Marker-Größen:
- **Großstadt:** 16px Durchmesser (größter Marker)
- **Mittelstadt:** 12px Durchmesser
- **Kleinstadt:** 10px Durchmesser (kleinster Marker)

### Farb-Codierung:
- **Rot (#EF4444):** Großstadt - höchste Priorität
- **Orange (#F59E0B):** Mittelstadt - mittlere Priorität
- **Grün (#10B981):** Kleinstadt - lokale Bedeutung

### Icons:
- 🏙️ Hochhäuser für Großstädte
- 🏘️ Stadtviertel für Mittelstädte
- 🏡 Haus für Kleinstädte

---

## 💻 Code-Nutzung

### Server Actions importieren:

```typescript
import { getCities, createCity, updateCity, deleteCity, getCityStats } from '@/app/actions/cities'
```

### Städte in Komponente laden:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCities } from '@/app/actions/cities'
import type { City } from '@/lib/types/city'

export default function MyCityComponent() {
  const [cities, setCities] = useState<City[]>([])
  
  useEffect(() => {
    async function load() {
      const data = await getCities()
      setCities(data)
    }
    load()
  }, [])
  
  return (
    <div>
      {cities.map(city => (
        <div key={city.id}>
          <h3>{city.name}</h3>
          <p>{city.population.toLocaleString('de-DE')} Einwohner</p>
          <p>{city.digitalization_budget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
        </div>
      ))}
    </div>
  )
}
```

### Statistiken abrufen:

```typescript
import { getCityStats } from '@/app/actions/cities'

const stats = await getCityStats()
// {
//   total: 10,
//   totalPopulation: 1728000,
//   totalBudget: 69600000,
//   byCategory: { Großstadt: 2, Mittelstadt: 6, Kleinstadt: 2 }
// }
```

---

## 🔄 Automatische Kategorisierung

Das Formular kategorisiert Städte automatisch basierend auf Einwohnerzahl:

```typescript
// Logik in AddCityForm.tsx
if (population >= 100000) {
  category = 'Großstadt'
} else if (population >= 20000) {
  category = 'Mittelstadt'
} else {
  category = 'Kleinstadt'
}
```

Beispiele:
- 150.000 Einwohner → 🏙️ Großstadt
- 50.000 Einwohner → 🏘️ Mittelstadt
- 15.000 Einwohner → 🏡 Kleinstadt

---

## 📍 Geocoding für Städte

Das System verwendet Nominatim API:

```typescript
// Automatischer Aufruf:
const address = `${stadtname}, Niedersachsen, Deutschland`
const coords = await geocodeAddress(address)
// Returns: { lat: 52.xxxx, lng: 9.xxxx }
```

**Wichtig:** 
- Geocoding ist **kostenlos** (OpenStreetMap)
- Rate Limit: 1 Request pro Sekunde
- User-Agent Header wird automatisch gesetzt

---

## 🗺️ Karten-Integration

### Beide Marker-Typen gleichzeitig:

```typescript
<MapComponent
  companies={companies}    // Beratungsunternehmen
  cities={cities}          // Städte
  showCities={true}        // Toggle für Stadt-Marker
  enableClustering={true}  // Clustering für Unternehmen
  onMarkerClick={handleCompanyClick}
  onCityClick={handleCityClick}
/>
```

### Z-Index Reihenfolge:
1. Städte-Marker (z-index: 400) - Im Hintergrund
2. Unternehmen-Marker (z-index: 600) - Im Vordergrund

So überlappen Unternehmen die Städte und sind leichter klickbar.

---

## 📊 Statistik-Dashboard (Optional)

Erweitere das Admin-Panel mit Statistiken:

```typescript
// components/Admin/CityStats.tsx
import { getCityStats } from '@/app/actions/cities'

export default async function CityStats() {
  const stats = await getCityStats()
  
  if (!stats) return null
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Städte gesamt</h3>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Gesamtbevölkerung</h3>
        <p className="text-3xl font-bold">
          {(stats.totalPopulation / 1000000).toFixed(1)}M
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Gesamt-Digitalbudget</h3>
        <p className="text-3xl font-bold">
          {(stats.totalBudget / 1000000).toFixed(1)}M €
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Kategorien</h3>
        <p className="text-sm">
          🏙️ {stats.byCategory.Großstadt} • 
          🏘️ {stats.byCategory.Mittelstadt} • 
          🏡 {stats.byCategory.Kleinstadt}
        </p>
      </div>
    </div>
  )
}
```

---

## 🎯 SQL-Befehle (Supabase)

### Migration 2 ausführen (JETZT!):

```sql
-- Kopiere aus: supabase/migrations/002_cities_schema.sql

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  population INTEGER NOT NULL DEFAULT 0,
  digitalization_budget DECIMAL(12, 2) DEFAULT 0,
  city_category TEXT NOT NULL CHECK (city_category IN ('Großstadt', 'Mittelstadt', 'Kleinstadt')),
  description TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name)
);

-- ... (rest of SQL from the file)
```

### Zusätzliche Städte hinzufügen (manuell):

```sql
INSERT INTO cities (name, latitude, longitude, population, digitalization_budget, city_category, description, website) VALUES
  ('Emden', 53.3673, 7.2060, 50000, 2500000, 'Kleinstadt', 'Hafenstadt mit Fokus auf Maritime Digitalisierung', 'https://www.emden.de'),
  ('Cuxhaven', 53.8667, 8.6833, 48000, 2200000, 'Kleinstadt', 'Küstenstadt mit Tourismus-Digitalisierung', 'https://www.cuxhaven.de');
```

---

## 📁 Neue Dateien

```
niedersachsen-beratungsmap/
├── supabase/migrations/
│   └── 002_cities_schema.sql         # ⭐ Städte-Datenbank Schema
├── lib/types/
│   └── city.ts                       # TypeScript Types für Städte
├── app/actions/
│   └── cities.ts                     # Server Actions (CRUD)
├── components/Admin/
│   ├── AddCityForm.tsx               # Formular zum Hinzufügen
│   └── CityList.tsx                  # Tabelle mit allen Städten
└── CITIES_SYSTEM_GUIDE.md            # Diese Anleitung
```

---

## 🔧 API Endpoints

### Neue Server Actions:

```typescript
// Alle Städte abrufen
const cities = await getCities()

// Stadt erstellen
const newCity = await createCity({
  name: 'Stade',
  latitude: 53.5967,
  longitude: 9.4744,
  population: 48000,
  digitalization_budget: 2400000,
  city_category: 'Kleinstadt',
  description: 'Hansestadt an der Elbe',
  website: 'https://www.stade.de'
})

// Stadt löschen
await deleteCity(cityId)

// Statistiken
const stats = await getCityStats()
```

---

## 💡 Best Practices

### Einwohnerzahl:
- Nutze **aktuelle** Zahlen (2024/2025)
- Runde auf 1.000er (z.B. 48.000 statt 47.834)

### Digitalisierungsbudget:
- **Realistische Werte:**
  - Großstadt: 8-15 Mio. € pro Jahr
  - Mittelstadt: 3-6 Mio. € pro Jahr
  - Kleinstadt: 1-3 Mio. € pro Jahr
- Wolfsburg hat das höchste Budget (15 Mio. €) wegen VW!

### Beschreibungen:
- Fokus auf **Digitalisierungs-Aspekte**
- Besonderheiten erwähnen (z.B. "Universitätsstadt")
- Kurz und prägnant (1-2 Sätze)

---

## 🆕 Neue Features auf der Karte

### Vorher:
- Nur Unternehmens-Marker (💼)

### Nachher:
- **Städte-Marker** (🏙️🏘️🏡) mit Größe nach Einwohnerzahl
- **Legende** (zeigt alle Marker-Typen)
- **Toggle** zum Ein-/Ausblenden
- **Statistik** im Header ("X Unternehmen in Y Städten")

---

## 🎉 Zusammenfassung

### Was funktioniert:

✅ **10 Städte vordefiniert** (automatisch nach SQL-Ausführung)  
✅ **Visualisierung** mit unterschiedlichen Größen & Farben  
✅ **Admin-Panel** zum Hinzufügen/Löschen  
✅ **Automatisches Geocoding** für neue Städte  
✅ **Detaillierte Popups** mit Statistiken  
✅ **Legende** auf der Karte  
✅ **Toggle** zum Ein-/Ausblenden  
✅ **TypeScript** voll typisiert  
✅ **RLS** Security aktiviert  

### Nächste Schritte:

1. **SQL-Schema ausführen** in Supabase (Migration 002)
2. **App testen:** Städte-Marker sollten erscheinen
3. **Optional:** Beispielunternehmen laden (`npm run seed`)
4. **Weitere Städte hinzufügen** über Admin-Panel

---

**Das Städte-System ist vollständig integriert und einsatzbereit! 🚀**

Bei Fragen: Siehe die anderen Dokumentationen (README.md, DEPLOYMENT.md, etc.)

