-- Tabelle für Städte
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- 3 Hauptattribute
  population INTEGER NOT NULL DEFAULT 0,
  digitalization_budget DECIMAL(12, 2) DEFAULT 0,
  city_category TEXT NOT NULL CHECK (city_category IN ('Großstadt', 'Mittelstadt', 'Kleinstadt')),
  
  -- Zusätzliche Felder
  description TEXT,
  website TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(name)
);

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_category ON cities(city_category);
CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population);

-- Row Level Security aktivieren
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann lesen
CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT
  USING (true);

-- Policy: Nur authentifizierte User können erstellen
CREATE POLICY "Authenticated users can insert cities"
  ON cities FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Nur authentifizierte User können updaten
CREATE POLICY "Authenticated users can update cities"
  ON cities FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Nur authentifizierte User können löschen
CREATE POLICY "Authenticated users can delete cities"
  ON cities FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trigger für updated_at
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed Daten: Hauptstädte Niedersachsens
INSERT INTO cities (name, latitude, longitude, population, digitalization_budget, city_category, description, website) VALUES
  ('Hannover', 52.3759, 9.7320, 545000, 12500000, 'Großstadt', 'Landeshauptstadt von Niedersachsen und wichtigstes Technologiezentrum der Region', 'https://www.hannover.de'),
  ('Braunschweig', 52.2689, 10.5268, 250000, 8000000, 'Großstadt', 'Forschungsstandort mit Technischer Universität und zahlreichen Instituten', 'https://www.braunschweig.de'),
  ('Oldenburg', 53.1435, 8.2146, 170000, 5500000, 'Mittelstadt', 'Universitätsstadt mit Fokus auf erneuerbare Energien', 'https://www.oldenburg.de'),
  ('Osnabrück', 52.2799, 8.0472, 165000, 5200000, 'Mittelstadt', 'Friedensstadt mit wachsendem IT-Sektor', 'https://www.osnabrueck.de'),
  ('Göttingen', 51.5341, 9.9355, 120000, 4800000, 'Mittelstadt', 'Universitätsstadt mit starkem Forschungsschwerpunkt', 'https://www.goettingen.de'),
  ('Wolfsburg', 52.4227, 10.7865, 125000, 15000000, 'Mittelstadt', 'Automobilstadt mit hoher Digitalisierungsrate', 'https://www.wolfsburg.de'),
  ('Hildesheim', 52.1513, 9.9502, 102000, 3500000, 'Mittelstadt', 'Historische Stadt mit wachsender Digitalwirtschaft', 'https://www.hildesheim.de'),
  ('Salzgitter', 52.1533, 10.4164, 104000, 4200000, 'Mittelstadt', 'Industriestandort im Wandel zur Smart City', 'https://www.salzgitter.de'),
  ('Celle', 52.6240, 10.0807, 70000, 2800000, 'Kleinstadt', 'Fachwerkstadt mit digitalem Wirtschaftsförderungsprogramm', 'https://www.celle.de'),
  ('Lüneburg', 53.2506, 10.4143, 77000, 3100000, 'Kleinstadt', 'Universitätsstadt mit nachhaltigem Digitalisierungskonzept', 'https://www.lueneburg.de')
ON CONFLICT (name) DO NOTHING;

