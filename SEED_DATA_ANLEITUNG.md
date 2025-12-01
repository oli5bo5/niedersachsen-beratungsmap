# 🌱 Beispieldaten in die Datenbank laden

## ✅ Voraussetzungen

1. ✅ SQL-Schema wurde in Supabase ausgeführt (`001_initial_schema.sql`)
2. ✅ Tabellen `consulting_companies`, `specializations` und `company_specializations` existieren
3. ✅ Environment Variables sind gesetzt (`.env.local`)

---

## 📊 Beispielunternehmen (6 Stück)

Das Seed-Script fügt automatisch **6 Beispielunternehmen** aus verschiedenen Städten in Niedersachsen hinzu:

1. **Digital Pioneers Hannover** - Digitalisierung, KI, Prozessoptimierung
2. **TechConsult Braunschweig** - Cloud-Migration, Cybersecurity
3. **Innovation Hub Oldenburg** - KI-Beratung, Datenanalyse
4. **SmartBiz Solutions Osnabrück** - ERP-Systeme, Workflow-Automatisierung
5. **CyberGuard Göttingen** - IT-Sicherheit, DSGVO-Beratung
6. **AutoTech Advisors Wolfsburg** - Automotive-Digitalisierung

---

## 🚀 Seed-Script ausführen

### Option 1: Mit npm Script (empfohlen)

```bash
cd niedersachsen-beratungsmap
npm run seed
```

### Option 2: Direkt mit tsx

```bash
npx tsx scripts/seed-companies.ts
```

---

## 📋 Was passiert beim Seeding?

Das Script:

1. ✅ Lädt alle Spezialisierungen aus der Datenbank
2. ✅ Erstellt 6 Beispielunternehmen mit vollständigen Daten
3. ✅ Verknüpft jedes Unternehmen mit seinen Spezialisierungen
4. ✅ Zeigt detaillierte Fortschrittsmeldungen
5. ✅ Gibt eine Zusammenfassung aus (Erfolge/Fehler)

---

## ✅ Erfolgreiche Ausgabe

```
🌱 Starte Seed-Prozess für Beispielunternehmen...

📋 Lade Spezialisierungen...
✅ 5 Spezialisierungen gefunden

📍 Füge hinzu: Digital Pioneers Hannover (Hannover)
   ✅ Erfolgreich hinzugefügt (3 Spezialisierungen)
📍 Füge hinzu: TechConsult Braunschweig (Braunschweig)
   ✅ Erfolgreich hinzugefügt (3 Spezialisierungen)
...

==================================================
🎉 Seed-Prozess abgeschlossen!
✅ Erfolgreich: 6 Unternehmen
==================================================
```

---

## 🔍 Überprüfung

Nach dem Seeding:

### 1. In Supabase überprüfen

1. Gehe zu **Table Editor** → `consulting_companies`
2. Du solltest **6 Einträge** sehen

### 2. Auf der Website überprüfen

1. Öffne deine deployed App: `https://niedersachsen-beratungsmap.vercel.app`
2. Die Karte sollte **6 Marker** in verschiedenen Städten zeigen
3. Klicke auf einen Marker → Popup mit Firmendaten

### 3. Im Admin-Panel überprüfen

1. Gehe zu `/admin`
2. Scrolle nach unten zur Tabelle
3. Alle 6 Unternehmen sollten aufgelistet sein

---

## 🆘 Troubleshooting

### Fehler: "Keine Spezialisierungen gefunden"

**Lösung:** SQL-Schema wurde noch nicht ausgeführt
```bash
# Führen Sie 001_initial_schema.sql in Supabase SQL Editor aus
```

### Fehler: "NEXT_PUBLIC_SUPABASE_URL ist nicht gesetzt"

**Lösung:** Environment Variables fehlen

1. Erstellen Sie `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

2. Führen Sie das Script erneut aus

### Fehler: "duplicate key value violates unique constraint"

**Bedeutung:** Unternehmen wurden bereits hinzugefügt

**Lösung:** 
- Entweder: Ignorieren (Daten sind schon da!)
- Oder: Alte Daten löschen in Supabase Table Editor und erneut ausführen

### Fehler: "permission denied"

**Lösung:** RLS Policies prüfen
- Stellen Sie sicher, dass die RLS Policies aus dem SQL-Schema ausgeführt wurden
- Public READ sollte aktiv sein

---

## 🔄 Daten erneut laden

Um die Beispieldaten erneut zu laden:

1. **Alte Daten löschen:**
   - Supabase Dashboard → Table Editor → `consulting_companies`
   - Alle Einträge löschen (oder einzelne auswählen)

2. **Script erneut ausführen:**
```bash
npm run seed
```

---

## 📝 Eigene Daten hinzufügen

### Option 1: Über das Admin-Panel (empfohlen)

1. Gehe zu `/admin`
2. Fülle das Formular aus
3. Klicke "Geocode" um Koordinaten zu finden
4. Klicke "Unternehmen hinzufügen"

### Option 2: Script anpassen

Bearbeiten Sie `scripts/seed-companies.ts` und fügen Sie eigene Unternehmen hinzu:

```typescript
const exampleCompanies = [
  // ... bestehende Unternehmen
  {
    name: 'Ihre Firma GmbH',
    city: 'Ihre Stadt',
    address: 'Ihre Straße 123, PLZ Stadt',
    latitude: 52.xxxx,
    longitude: 9.xxxx,
    description: 'Ihre Beschreibung...',
    website: 'https://ihre-website.de',
    email: 'info@ihre-firma.de',
    phone: '+49 xxx xxxxx',
    specializations: ['Digitalisierung', 'KI-Beratung'], // Namen aus der DB
  },
]
```

Dann ausführen:
```bash
npm run seed
```

---

## 🎉 Fertig!

Nach dem erfolgreichen Seeding:

- ✅ **6 Beispielunternehmen** sind in der Datenbank
- ✅ **Marker erscheinen** auf der Karte
- ✅ **Filter funktionieren** (nach Spezialisierung)
- ✅ **Suche funktioniert** (nach Name, Stadt, Beschreibung)
- ✅ **Export funktioniert** (CSV, GeoJSON, PDF)

Ihre App ist jetzt **komplett einsatzbereit** mit echten Beispieldaten! 🚀





