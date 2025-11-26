-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create consulting_companies table
CREATE TABLE IF NOT EXISTS consulting_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    website TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create specializations table
CREATE TABLE IF NOT EXISTS specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    color TEXT
);

-- Create company_specializations junction table
CREATE TABLE IF NOT EXISTS company_specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES consulting_companies(id) ON DELETE CASCADE,
    specialization_id UUID NOT NULL REFERENCES specializations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, specialization_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_company_specializations_company_id ON company_specializations(company_id);
CREATE INDEX IF NOT EXISTS idx_company_specializations_specialization_id ON company_specializations(specialization_id);
CREATE INDEX IF NOT EXISTS idx_consulting_companies_name ON consulting_companies(name);

-- Enable Row Level Security
ALTER TABLE consulting_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_specializations ENABLE ROW LEVEL SECURITY;

-- Create policies for consulting_companies
CREATE POLICY "Enable read access for all users" ON consulting_companies
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON consulting_companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON consulting_companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON consulting_companies
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for specializations
CREATE POLICY "Enable read access for all users" ON specializations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON specializations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON specializations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON specializations
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for company_specializations
CREATE POLICY "Enable read access for all users" ON company_specializations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON company_specializations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON company_specializations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON company_specializations
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert seed data for specializations
INSERT INTO specializations (name, icon, color) VALUES
    ('Digitalisierung', '🔄', '#3B82F6'),
    ('KI-Beratung', '🤖', '#8B5CF6'),
    ('Cloud-Migration', '☁️', '#06B6D4'),
    ('Cybersecurity', '🔒', '#EF4444'),
    ('Prozessoptimierung', '⚙️', '#10B981')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_consulting_companies_updated_at 
    BEFORE UPDATE ON consulting_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

