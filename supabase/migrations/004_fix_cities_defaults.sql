-- Fix: Add DEFAULT to city_category for better NULL handling
-- This allows the database to handle missing values gracefully

-- Option 1: Add DEFAULT constraint (recommended)
ALTER TABLE cities 
ALTER COLUMN city_category SET DEFAULT 'Kleinstadt';

-- Option 2: Make city_category nullable (alternative)
-- ALTER TABLE cities 
-- ALTER COLUMN city_category DROP NOT NULL;

-- Verify the change
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'cities' 
  AND column_name IN ('population', 'digitalization_budget', 'city_category');





