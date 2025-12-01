-- Add specializations support to cities table

-- Option 1: Simple array column (easier, recommended for cities)
ALTER TABLE cities 
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}';

-- Create index for array search
CREATE INDEX IF NOT EXISTS idx_cities_specializations ON cities USING GIN (specializations);

-- Option 2: Junction table (if you want to reuse specializations from companies)
-- This allows cities to have the same specializations as companies

CREATE TABLE IF NOT EXISTS city_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  specialization_id UUID NOT NULL REFERENCES specializations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city_id, specialization_id)
);

-- Create indexes for junction table
CREATE INDEX IF NOT EXISTS idx_city_specializations_city_id ON city_specializations(city_id);
CREATE INDEX IF NOT EXISTS idx_city_specializations_specialization_id ON city_specializations(specialization_id);

-- RLS for city_specializations
ALTER TABLE city_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view city specializations"
  ON city_specializations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert city specializations"
  ON city_specializations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update city specializations"
  ON city_specializations FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete city specializations"
  ON city_specializations FOR DELETE
  USING (true);

-- Add comment
COMMENT ON COLUMN cities.specializations IS 'Array of specialization names (simple approach)';
COMMENT ON TABLE city_specializations IS 'Junction table linking cities to specializations (normalized approach)';

-- Example: Update existing cities with some specializations
-- UPDATE cities SET specializations = ARRAY['Digitalisierung', 'Cloud-Migration'] WHERE name = 'Hannover';
-- UPDATE cities SET specializations = ARRAY['KI-Beratung', 'Prozessoptimierung'] WHERE name = 'Wolfsburg';





