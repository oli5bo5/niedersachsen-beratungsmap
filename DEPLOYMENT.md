# Deployment Anleitung

## 🚀 Schritt-für-Schritt Deployment auf Vercel

### 1. Voraussetzungen

- GitHub Account
- Vercel Account (kostenlos bei [vercel.com](https://vercel.com))
- Supabase Account (kostenlos bei [supabase.com](https://supabase.com))

### 2. Supabase Projekt erstellen

1. Gehe zu [https://supabase.com](https://supabase.com)
2. Klicke auf "New Project"
3. Projektdetails:
   - **Name:** Niedersachsen Beratungsmap
   - **Database Password:** Generiere ein sicheres Passwort (speichern!)
   - **Region:** Frankfurt (nächste zu Deutschland)
4. Warte bis das Projekt erstellt ist (~2 Minuten)

### 3. Datenbank Schema ausführen

1. Im Supabase Dashboard → **SQL Editor**
2. Öffne die Datei `supabase/migrations/001_initial_schema.sql` aus diesem Projekt
3. Kopiere den kompletten SQL-Code
4. Füge ihn im SQL Editor ein und klicke **"Run"**
5. Überprüfe unter **Table Editor**, ob die Tabellen erstellt wurden:
   - `consulting_companies`
   - `specializations`
   - `company_specializations`

### 4. Supabase API Keys notieren

1. Im Supabase Dashboard → **Settings** → **API**
2. Notiere folgende Werte:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public Key:** `eyJhbGc...` (langer String)

### 5. GitHub Repository erstellen

```bash
# Im Projekt-Verzeichnis
git init
git add .
git commit -m "Initial commit: Niedersachsen Beratungsmap"

# Erstelle ein neues Repository auf GitHub (z.B. "niedersachsen-beratungsmap")
git remote add origin https://github.com/DEIN-USERNAME/niedersachsen-beratungsmap.git
git branch -M main
git push -u origin main
```

### 6. Vercel Projekt erstellen

1. Gehe zu [https://vercel.com](https://vercel.com)
2. Klicke auf **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Verbinde deinen GitHub Account (falls noch nicht verbunden)
   - Wähle das Repository `niedersachsen-beratungsmap`
4. **Configure Project:**
   - Framework Preset: **Next.js** (wird automatisch erkannt)
   - Root Directory: `./` (Standard)
   - Build Command: `npm run build` (Standard)
   - Output Directory: `.next` (Standard)

### 7. Environment Variables in Vercel setzen

Bevor du auf "Deploy" klickst:

1. Klicke auf **"Environment Variables"**
2. Füge folgende Variablen hinzu:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Deine Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dein Supabase Anon Key | Production, Preview, Development |

3. Klicke auf **"Deploy"**

### 8. Deployment abwarten

- Vercel baut und deployed dein Projekt automatisch (~2-3 Minuten)
- Du erhältst eine URL wie: `https://niedersachsen-beratungsmap.vercel.app`

### 9. Niedersachsen GeoJSON herunterladen (lokal)

**Wichtig:** Führe diesen Schritt lokal aus, bevor du die Karte nutzt:

```bash
npm run download-map
```

Dies lädt die Niedersachsen-Grenzdaten herunter und speichert sie in `public/maps/niedersachsen.geojson`.

**Dann pushe die Änderung zu GitHub:**

```bash
git add public/maps/niedersachsen.geojson
git commit -m "Add Niedersachsen GeoJSON"
git push
```

Vercel deployed automatisch die aktualisierte Version.

### 10. Erste Daten hinzufügen

1. Öffne deine deployed App: `https://deine-url.vercel.app`
2. Navigiere zu `/admin` (z.B. `https://deine-url.vercel.app/admin`)
3. Füge dein erstes Unternehmen hinzu

---

## 🔄 Automatisches Deployment

**Jedes Mal, wenn du Code zu GitHub pushst, wird automatisch deployed:**

```bash
git add .
git commit -m "Deine Änderung"
git push
```

Vercel erkennt den Push und führt automatisch ein neues Deployment durch.

---

## 🐛 Troubleshooting

### Fehler: "Missing Supabase environment variables"

- Überprüfe, ob die Environment Variables in Vercel richtig gesetzt sind
- Stelle sicher, dass sie für alle Environments (Production, Preview, Development) gesetzt sind
- Redeploy das Projekt nach dem Setzen der Variablen

### Fehler: "Failed to load GeoJSON"

- Stelle sicher, dass `npm run download-map` lokal ausgeführt wurde
- Prüfe, ob die Datei `public/maps/niedersachsen.geojson` existiert
- Pushe die Datei zu GitHub

### Karte lädt nicht / Map bleibt weiß

- Öffne die Browser-Konsole (F12) und prüfe auf Fehler
- Stelle sicher, dass Leaflet CSS korrekt geladen wird
- Prüfe, ob die GeoJSON-Datei erreichbar ist: `https://deine-url.vercel.app/maps/niedersachsen.geojson`

### Keine Daten sichtbar

- Prüfe, ob das SQL-Schema in Supabase korrekt ausgeführt wurde
- Überprüfe die Supabase API Keys
- Prüfe die Row Level Security (RLS) Policies in Supabase

---

## 📊 Monitoring

### Vercel Dashboard

- **Deployments:** Übersicht aller Deployments
- **Analytics:** Besucherzahlen (im kostenlosen Plan begrenzt)
- **Logs:** Fehlerprotokolle

### Supabase Dashboard

- **Table Editor:** Daten direkt bearbeiten
- **Logs:** Datenbankabfragen überwachen
- **Storage:** Speicherplatz überwachen

---

## 🔐 Sicherheit (Empfehlungen für Produktion)

1. **Supabase RLS (Row Level Security):**
   - Aktuell: Leserechte für alle, Schreibrechte nur für authentifizierte User
   - Für Admin-Panel: Implementiere Supabase Auth mit Email/Password

2. **Admin-Route schützen:**
   - Derzeit: Middleware ist vorbereitet, aber erlaubt Zugriff ohne Auth
   - Für Produktion: Aktiviere echte Auth-Prüfung in `middleware.ts`

3. **Rate Limiting:**
   - Implementiere Rate Limiting für Geocoding API
   - Nutze Vercel Edge Config oder externe Services

---

## 💰 Kosten

**Alles kostenlos für kleine Projekte:**

- ✅ **Vercel:** Hobby Plan (kostenlos)
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Serverless Functions

- ✅ **Supabase:** Free Tier (kostenlos)
  - 500 MB Datenbank
  - 1 GB Dateispeicher
  - 50.000 Monthly Active Users

- ✅ **OpenStreetMap Tiles:** Kostenlos
- ✅ **Nominatim Geocoding:** Kostenlos (mit Rate Limiting)

---

## 🌐 Custom Domain (Optional)

1. Im Vercel Dashboard → **Settings** → **Domains**
2. Füge deine Domain hinzu (z.B. `beratungsmap.beispiel.de`)
3. Folge den DNS-Anweisungen von Vercel
4. SSL/HTTPS wird automatisch konfiguriert

---

## ✅ Deployment Checkliste

- [ ] Supabase Projekt erstellt
- [ ] SQL Schema ausgeführt
- [ ] Supabase API Keys notiert
- [ ] GitHub Repository erstellt und Code gepusht
- [ ] `npm run download-map` lokal ausgeführt
- [ ] GeoJSON zu GitHub gepusht
- [ ] Vercel Projekt mit GitHub verbunden
- [ ] Environment Variables in Vercel gesetzt
- [ ] Erfolgreiches Deployment
- [ ] Map lädt und zeigt Niedersachsen
- [ ] Admin-Panel erreichbar (`/admin`)
- [ ] Erstes Unternehmen hinzugefügt
- [ ] Marker erscheint auf Karte
- [ ] Filter funktionieren

---

Bei Fragen oder Problemen: Prüfe die Vercel und Supabase Logs!





