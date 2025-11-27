-- ⚠️ FIX: Erlaube JEDEM das Hinzufügen/Bearbeiten von Daten (für Demo-Zwecke)
-- Für Production sollten Sie echte Authentifizierung implementieren!

-- ========================================
-- UNTERNEHMEN: Policies anpassen
-- ========================================

-- Entferne alte restrictive Policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON consulting_companies;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON consulting_companies;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON consulting_companies;

-- Neue permissive Policies (JEDER kann erstellen/bearbeiten/löschen)
CREATE POLICY "Anyone can insert companies"
  ON consulting_companies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update companies"
  ON consulting_companies FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete companies"
  ON consulting_companies FOR DELETE
  USING (true);

-- ========================================
-- SPEZIALISIERUNGEN: Policies anpassen
-- ========================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON specializations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON specializations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON specializations;

CREATE POLICY "Anyone can insert specializations"
  ON specializations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update specializations"
  ON specializations FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete specializations"
  ON specializations FOR DELETE
  USING (true);

-- ========================================
-- COMPANY_SPECIALIZATIONS: Policies anpassen
-- ========================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON company_specializations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON company_specializations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON company_specializations;

CREATE POLICY "Anyone can insert company_specializations"
  ON company_specializations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update company_specializations"
  ON company_specializations FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete company_specializations"
  ON company_specializations FOR DELETE
  USING (true);

-- ========================================
-- STÄDTE: Policies anpassen
-- ========================================

DROP POLICY IF EXISTS "Authenticated users can insert cities" ON cities;
DROP POLICY IF EXISTS "Authenticated users can update cities" ON cities;
DROP POLICY IF EXISTS "Authenticated users can delete cities" ON cities;

CREATE POLICY "Anyone can insert cities"
  ON cities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cities"
  ON cities FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete cities"
  ON cities FOR DELETE
  USING (true);

-- ========================================
-- BESTÄTIGUNG
-- ========================================

-- Zeige alle aktiven Policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('consulting_companies', 'specializations', 'company_specializations', 'cities')
ORDER BY tablename, policyname;



