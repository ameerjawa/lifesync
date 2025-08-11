/*
  # Add subscription system
  
  1. New Tables
    - `subscriptions`
      - Tracks user subscription status and plan
    - `feature_flags`
      - Defines available features
    - `plan_features`
      - Maps features to subscription plans
  
  2. Changes
    - Add subscription_id to profiles table
    
  3. Security
    - Enable RLS on new tables
    - Add policies for feature access
*/

-- Create subscription types
CREATE TYPE subscription_plan AS ENUM (
  'free',
  'premium',
  'enterprise'
);

CREATE TYPE subscription_status AS ENUM (
  'active',
  'cancelled',
  'past_due',
  'trialing'
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feature flags table
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create plan features table
CREATE TABLE plan_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan subscription_plan NOT NULL,
  feature_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan, feature_id)
);

-- Add subscription_id to profiles
ALTER TABLE profiles 
ADD COLUMN subscription_id uuid REFERENCES subscriptions(id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view feature flags"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view plan features"
  ON plan_features FOR SELECT
  TO authenticated
  USING (true);

-- Insert default feature flags
INSERT INTO feature_flags (name, description) VALUES
  ('unlimited_tasks', 'Unlimited task creation'),
  ('ai_insights', 'AI-powered insights and recommendations'),
  ('advanced_analytics', 'Advanced analytics and reporting'),
  ('custom_dashboards', 'Custom dashboard layouts'),
  ('data_export', 'Data export functionality'),
  ('priority_support', 'Priority customer support'),
  ('team_collaboration', 'Team collaboration features'),
  ('api_access', 'API access'),
  ('advanced_security', 'Advanced security features'),
  ('custom_integrations', 'Custom integration support');

-- Map features to plans
INSERT INTO plan_features (plan, feature_id) 
SELECT 'premium', id FROM feature_flags 
WHERE name IN (
  'unlimited_tasks',
  'ai_insights',
  'advanced_analytics',
  'custom_dashboards',
  'data_export',
  'priority_support'
);

INSERT INTO plan_features (plan, feature_id)
SELECT 'enterprise', id FROM feature_flags;

-- Create function to check feature access
CREATE OR REPLACE FUNCTION check_feature_access(feature_name text)
RETURNS boolean AS $$
DECLARE
  user_plan subscription_plan;
BEGIN
  -- Get user's current plan
  SELECT plan INTO user_plan
  FROM subscriptions s
  JOIN profiles p ON p.subscription_id = s.id
  WHERE p.id = auth.uid()
  AND s.status = 'active';

  -- If no active subscription, user is on free plan
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;

  -- Check if feature is available for user's plan
  RETURN EXISTS (
    SELECT 1
    FROM feature_flags f
    JOIN plan_features pf ON pf.feature_id = f.id
    WHERE f.name = feature_name
    AND pf.plan = user_plan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's plan
CREATE OR REPLACE FUNCTION get_user_plan()
RETURNS subscription_plan AS $$
DECLARE
  user_plan subscription_plan;
BEGIN
  SELECT plan INTO user_plan
  FROM subscriptions s
  JOIN profiles p ON p.subscription_id = s.id
  WHERE p.id = auth.uid()
  AND s.status = 'active';

  RETURN COALESCE(user_plan, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;