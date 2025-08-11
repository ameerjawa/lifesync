/*
  # Add Permissions Management System

  1. New Tables
    - `feature_flags` - Stores available features
    - `plan_features` - Maps features to subscription plans
    - `user_features` - Stores custom feature overrides per user

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Add functions for feature checking

  3. Changes
    - Add subscription_id to profiles table
    - Add default features and plan mappings
*/

-- Create feature flags table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS feature_flags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create plan features table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS plan_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan text NOT NULL,
    feature_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(plan, feature_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create user features table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS user_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    feature_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
    enabled boolean NOT NULL DEFAULT true,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, feature_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;

-- Create policies (will be ignored if they already exist)
DO $$ BEGIN
  CREATE POLICY "Anyone can view feature flags"
    ON feature_flags FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view plan features"
    ON plan_features FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their feature overrides"
    ON user_features FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create or replace function to check feature access
CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id uuid,
  p_feature_name text
) RETURNS boolean AS $$
DECLARE
  v_has_access boolean;
  v_user_plan text;
BEGIN
  -- First check user-specific overrides
  SELECT enabled INTO v_has_access
  FROM user_features uf
  JOIN feature_flags ff ON ff.id = uf.feature_id
  WHERE uf.user_id = p_user_id
  AND ff.name = p_feature_name
  AND (uf.expires_at IS NULL OR uf.expires_at > now());

  IF v_has_access IS NOT NULL THEN
    RETURN v_has_access;
  END IF;

  -- Then check plan-based access
  SELECT plan INTO v_user_plan
  FROM profiles p
  JOIN subscriptions s ON s.id = p.subscription_id
  WHERE p.id = p_user_id
  AND s.status = 'active';

  RETURN EXISTS (
    SELECT 1
    FROM feature_flags ff
    JOIN plan_features pf ON pf.feature_id = ff.id
    WHERE ff.name = p_feature_name
    AND pf.plan = COALESCE(v_user_plan, 'free')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default features if they don't exist
DO $$ 
DECLARE
  feature record;
  feature_id uuid;
BEGIN
  FOR feature IN 
    SELECT * FROM (VALUES
      ('unlimited_tasks', 'Create unlimited tasks'),
      ('ai_insights', 'AI-powered insights and recommendations'),
      ('advanced_analytics', 'Advanced analytics and reporting'),
      ('custom_dashboards', 'Custom dashboard layouts'),
      ('data_export', 'Export data in various formats'),
      ('priority_support', 'Priority customer support'),
      ('team_collaboration', 'Team collaboration features'),
      ('api_access', 'API access for integrations'),
      ('advanced_security', 'Advanced security features'),
      ('custom_integrations', 'Custom integration support')
    ) AS t(name, description)
  LOOP
    -- Insert feature if it doesn't exist
    INSERT INTO feature_flags (name, description)
    VALUES (feature.name, feature.description)
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO feature_id;
    
    -- If feature was inserted, map it to plans
    IF feature_id IS NOT NULL THEN
      -- Map to premium plan if applicable
      IF feature.name IN (
        'unlimited_tasks',
        'ai_insights',
        'advanced_analytics',
        'custom_dashboards',
        'data_export',
        'priority_support'
      ) THEN
        INSERT INTO plan_features (plan, feature_id)
        VALUES ('premium', feature_id)
        ON CONFLICT (plan, feature_id) DO NOTHING;
      END IF;

      -- Map to enterprise plan
      INSERT INTO plan_features (plan, feature_id)
      VALUES ('enterprise', feature_id)
      ON CONFLICT (plan, feature_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS feature_flags_name_idx ON feature_flags(name);
  CREATE INDEX IF NOT EXISTS plan_features_plan_idx ON plan_features(plan);
  CREATE INDEX IF NOT EXISTS user_features_user_id_idx ON user_features(user_id);
  CREATE INDEX IF NOT EXISTS user_features_expires_at_idx ON user_features(expires_at);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;