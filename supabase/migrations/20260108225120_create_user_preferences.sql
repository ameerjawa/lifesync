/*
  # Create user_preferences table

  1. Overview
    - Store user-specific preferences and settings for the application
    - Support for theme, notifications, display preferences, and custom settings
  
  2. New Table
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `theme` (text) - light, dark, or system
      - `notifications_enabled` (boolean)
      - `email_notifications` (boolean)
      - `push_notifications` (boolean)
      - `language` (text)
      - `timezone` (text)
      - `date_format` (text)
      - `currency` (text)
      - `custom_settings` (jsonb) - for additional flexible settings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  3. Security
    - Enable RLS on user_preferences table
    - Users can only access their own preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme text CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT false,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  date_format text DEFAULT 'MM/DD/YYYY',
  currency text DEFAULT 'USD',
  custom_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
