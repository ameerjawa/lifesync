-- Add missing profile fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT false;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS profiles_company_idx ON profiles(company);
CREATE INDEX IF NOT EXISTS profiles_timezone_idx ON profiles(timezone);
CREATE INDEX IF NOT EXISTS profiles_language_idx ON profiles(language);