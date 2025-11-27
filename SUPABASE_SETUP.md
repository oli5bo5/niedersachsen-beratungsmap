# 🗄️ Supabase Setup-Anleitung

## 📋 Schritt 1: Supabase Projekt erstellen

1. Gehe zu [https://supabase.com](https://supabase.com)
2. Klicke auf "New Project"
3. Name: `niedersachsen-beratungsmap`
4. Wähle eine Region (z.B. Frankfurt)
5. Erstelle ein sicheres Passwort für die Datenbank

## 🔑 Schritt 2: Environment Variables

1. Gehe zu Settings > API
2. Kopiere die folgenden Werte:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` Key → `SUPABASE_SERVICE_ROLE_KEY` (nur für Admin-Funktionen)

3. Erstelle `.env.local` im Root-Verzeichnis:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key
```

4. **Für Vercel Deployment:**
   - Gehe zu Vercel Dashboard > Project Settings > Environment Variables
   - Füge alle 3 Variablen hinzu

## 🗃️ Schritt 3: Datenbank-Schema erstellen

1. Gehe in Supabase Dashboard → SQL Editor
2. Klicke auf "New Query"
3. Kopiere das komplette SQL-Script unten
4. Klicke auf "Run"

### SQL Script:

\`\`\`sql
-- ============================================
-- TABELLE: specializations
-- ============================================
CREATE TABLE public.specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#8B5CF6',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELLE: consulting_companies
-- ============================================
CREATE TABLE public.consulting_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  website TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  logo_url TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JUNCTION TABLE: company_specializations
-- ============================================
CREATE TABLE public.company_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES consulting_companies(id) ON DELETE CASCADE,
  specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, specialization_id)
);

-- ============================================
-- INDIZES
-- ============================================
CREATE INDEX idx_companies_city ON consulting_companies(city);
CREATE INDEX idx_companies_location ON consulting_companies(lat, lng);
CREATE INDEX idx_company_spec_company ON company_specializations(company_id);
CREATE INDEX idx_company_spec_spec ON company_specializations(specialization_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.consulting_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read - Companies" 
  ON consulting_companies FOR SELECT 
  USING (true);

CREATE POLICY "Public Read - Specializations" 
  ON specializations FOR SELECT 
  USING (true);

CREATE POLICY "Public Read - Company Specs" 
  ON company_specializations FOR SELECT 
  USING (true);

-- ============================================
-- SEED DATA: Spezialisierungen
-- ============================================
INSERT INTO specializations (name, icon, color, description) VALUES
  ('KI & Machine Learning', '🤖', '#8B5CF6', 'Künstliche Intelligenz, Deep Learning'),
  ('Digitale Transformation', '🚀', '#3B82F6', 'Prozessdigitalisierung, Change Management'),
  ('Cloud Migration', '☁️', '#10B981', 'AWS, Azure, Google Cloud'),
  ('Cybersecurity', '🔒', '#EF4444', 'IT-Sicherheit, Compliance'),
  ('IoT & Industrie 4.0', '⚙️', '#F59E0B', 'Smart Factory, Edge Computing'),
  ('Datenanalyse & BI', '📊', '#06B6D4', 'Business Intelligence, Analytics');

-- ============================================
-- SEED DATA: Beispielunternehmen
-- ============================================
DO $$
DECLARE
  company1_id UUID := gen_random_uuid();
  company2_id UUID := gen_random_uuid();
  spec_ki_id UUID;
  spec_digital_id UUID;
  spec_cloud_id UUID;
BEGIN
  SELECT id INTO spec_ki_id FROM specializations WHERE name = 'KI & Machine Learning';
  SELECT id INTO spec_digital_id FROM specializations WHERE name = 'Digitale Transformation';
  SELECT id INTO spec_cloud_id FROM specializations WHERE name = 'Cloud Migration';

  INSERT INTO consulting_companies (id, name, city, address, lat, lng, website, phone, email, description, employee_count, founded_year)
  VALUES (
    company1_id,
    'DigiTransform Hannover GmbH',
    'Hannover',
    'Vahrenwalder Straße 7',
    52.3905689,
    9.7332532,
    'https://example.com',
    '+49 511 123456',
    'info@example.com',
    'Führendes Beratungsunternehmen für digitale Transformation.',
    45,
    2015
  );

  INSERT INTO company_specializations (company_id, specialization_id) VALUES
    (company1_id, spec_ki_id),
    (company1_id, spec_digital_id);

  INSERT INTO consulting_companies (id, name, city, address, lat, lng, website, phone, email, description, employee_count, founded_year)
  VALUES (
    company2_id,
    'CloudSec Braunschweig AG',
    'Braunschweig',
    'Hamburger Straße 267',
    52.2688736,
    10.5267696,
    'https://example.com',
    '+49 531 234567',
    'kontakt@example.com',
    'Experten für Cloud-Migration und Cybersecurity.',
    32,
    2017
  );

  INSERT INTO company_specializations (company_id, specialization_id) VALUES
    (company2_id, spec_cloud_id);
END $$;

-- ============================================
-- TRIGGER: Updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON consulting_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
\`\`\`

## ✅ Schritt 4: Testen

1. Gehe zu Table Editor in Supabase
2. Prüfe ob Tabellen erstellt wurden:
   - `specializations` (sollte 6 Einträge haben)
   - `consulting_companies` (sollte 2 Beispiele haben)
   - `company_specializations`

3. Teste die API:
   - Gehe zu API Docs
   - Teste `GET /consulting_companies`

## 🚀 Schritt 5: Deployment

1. **Lokal testen:**
   ```bash
   npm run dev
   ```

2. **Vercel Environment Variables:**
   - Füge alle 3 Supabase-Keys in Vercel hinzu
   - Redeploy

## 📊 Nächste Schritte

Nach erfolgreichem Setup kannst du:
- Weitere Unternehmen über das Admin-Panel hinzufügen
- Echte Daten in die Map laden
- Filter-Funktionen nutzen
- Export-Features verwenden

## 🆘 Troubleshooting

**Problem: "No rows returned"**
- Prüfe RLS Policies in Supabase Dashboard > Authentication > Policies

**Problem: "Invalid API Key"**
- Prüfe ob `.env.local` korrekt ist
- Restart Development Server nach Änderungen

**Problem: TypeScript Errors**
- Regeneriere Types: Supabase Dashboard > Settings > API > Generate Types
- Kopiere in `lib/supabase/database.types.ts`

