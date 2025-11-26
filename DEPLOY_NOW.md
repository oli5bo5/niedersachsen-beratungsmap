# 🚀 Deployment-Schritte (Jetzt ausführen!)

## ✅ Was bereits erledigt ist:
- ✅ Alle Dependencies installiert
- ✅ Niedersachsen GeoJSON heruntergeladen (21.47 KB)
- ✅ Production Build erfolgreich (keine Fehler!)
- ✅ Alle Komponenten getestet und optimiert

---

## 📋 Manuelle Schritte für vollständiges Deployment:

### 1️⃣ Supabase Projekt erstellen (5 Minuten)

1. Gehe zu [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Klicke "New Project"
3. Projektdetails:
   - **Organization:** Wähle oder erstelle eine
   - **Name:** `niedersachsen-beratungsmap`
   - **Database Password:** Generiere eins (SPEICHERN!)
   - **Region:** Frankfurt (eu-central-1)
4. Warte ~2 Minuten bis Projekt erstellt ist

#### SQL Schema ausführen:

1. Im Supabase Dashboard → **SQL Editor**
2. Klicke "New Query"
3. Öffne lokal: `supabase/migrations/001_initial_schema.sql`
4. Kopiere den GESAMTEN Inhalt
5. Füge in SQL Editor ein
6. Klicke **"Run"**
7. Überprüfe: Table Editor → sollte 3 Tabellen zeigen:
   - `consulting_companies`
   - `specializations` (mit 5 Einträgen)
   - `company_specializations`

#### API Keys notieren:

1. Settings → API
2. Kopiere:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public Key:** `eyJhbGc...` (langer String)

---

### 2️⃣ GitHub Repository erstellen (2 Minuten)

```bash
# Im Projektverzeichnis (niedersachsen-beratungsmap)
git init
git add .
git commit -m "Initial commit: Niedersachsen Beratungsmap - Production Ready"

# Auf GitHub.com:
# 1. Gehe zu https://github.com/new
# 2. Repository Name: niedersachsen-beratungsmap
# 3. Public oder Private (deine Wahl)
# 4. NICHT initialisiere mit README (schon vorhanden)
# 5. Klicke "Create repository"

# Zurück im Terminal:
git remote add origin https://github.com/DEIN-USERNAME/niedersachsen-beratungsmap.git
git branch -M main
git push -u origin main
```

---

### 3️⃣ Vercel Deployment (3 Minuten)

1. Gehe zu [https://vercel.com/new](https://vercel.com/new)
2. **Import Git Repository:**
   - Verbinde GitHub (falls noch nicht)
   - Wähle `niedersachsen-beratungsmap`
3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Install Command: `npm install`

#### Environment Variables setzen:

**WICHTIG:** Füge BEIDE Variablen hinzu (von Supabase):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Deine Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dein Supabase Anon Key | Production, Preview, Development |

4. Klicke **"Deploy"**
5. Warte ~2-3 Minuten
6. 🎉 Deine App ist live!

---

### 4️⃣ Erste Firma hinzufügen (1 Minute)

1. Öffne deine deployed URL: `https://dein-projekt.vercel.app`
2. Navigiere zu `/admin` (z.B. `https://dein-projekt.vercel.app/admin`)
3. Fülle das Formular aus:
   - Name: z.B. "Digital Consulting Hannover"
   - Adresse: z.B. "Georgstraße 1, 30159 Hannover"
   - Klicke "📍 Geocode" Button
   - Wähle Spezialisierungen
   - Klicke "Unternehmen hinzufügen"
4. Gehe zurück zur Hauptseite → Marker sollte auf Karte erscheinen!

---

## 🎯 Schnellstart für lokales Testen (JETZT möglich):

```bash
# Im Projektverzeichnis
npm run dev
```

Öffne: [http://localhost:3000](http://localhost:3000)

**Hinweis:** Ohne Supabase-Konfiguration siehst du nur die Karte (keine Daten).

Um lokal mit echten Daten zu testen:

1. Erstelle `.env.local` mit deinen Supabase-Credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
2. Starte neu: `npm run dev`

---

## 📊 Deployment Status:

| Schritt | Status | Zeit |
|---------|--------|------|
| ✅ Code komplett | Erledigt | - |
| ✅ Dependencies installiert | Erledigt | - |
| ✅ GeoJSON heruntergeladen | Erledigt | - |
| ✅ Production Build | Erfolgreich | - |
| ⏳ Supabase Setup | **→ DU BIST HIER** | ~5 min |
| ⏳ GitHub Push | Ausstehend | ~2 min |
| ⏳ Vercel Deployment | Ausstehend | ~3 min |
| ⏳ Erste Daten | Ausstehend | ~1 min |

**Gesamtzeit bis Live:** ~11 Minuten ⏱️

---

## 💡 Tipps:

### Custom Domain hinzufügen (Optional):
1. Vercel Dashboard → Dein Projekt → Settings → Domains
2. Füge deine Domain hinzu (z.B. `map.deine-domain.de`)
3. Folge den DNS-Anweisungen
4. SSL/HTTPS wird automatisch konfiguriert

### Performance Monitoring:
- Vercel Dashboard → Analytics (Besucherzahlen, etc.)
- Supabase Dashboard → Database → Logs (Abfragen überwachen)

### Backup erstellen:
```bash
# Supabase Dashboard → Database → Backups
# Automatische tägliche Backups aktiviert (kostenlos)
```

---

## 🆘 Probleme?

### Build-Fehler auf Vercel:
- Überprüfe Environment Variables (beide gesetzt?)
- Prüfe Vercel Build Logs
- Stelle sicher, dass `niedersachsen.geojson` auf GitHub ist

### Keine Daten sichtbar:
- SQL-Schema in Supabase ausgeführt?
- API Keys korrekt kopiert?
- RLS Policies aktiviert? (Überprüfe Table Editor)

### Map lädt nicht:
- Browser Console öffnen (F12)
- Überprüfe ob `niedersachsen.geojson` geladen wird
- URL testen: `https://deine-url.vercel.app/maps/niedersachsen.geojson`

---

## 🎓 Nach dem Deployment:

1. **Teile die App:**
   - URL: `https://dein-projekt.vercel.app`
   - Admin: `https://dein-projekt.vercel.app/admin`

2. **Füge mehr Firmen hinzu:**
   - Nutze das Admin-Panel
   - Geocoding funktioniert automatisch

3. **Exportiere Daten:**
   - Klicke "📥 Exportieren" im Header
   - Wähle CSV, GeoJSON oder PDF

---

**Viel Erfolg! 🚀**

Bei Fragen: Siehe `DEPLOYMENT.md` für Details oder `QUICK_START.md` für lokale Entwicklung.

