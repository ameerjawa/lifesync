/*
  # Fix Subscription RLS Policies

  1. Changes
    - Enable RLS on subscriptions table
    - Add policies for subscription management
    - Add policy for admin access
    - Add policy for user access
*/

-- Enable RLS on subscriptions table if not already enabled
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;

-- Create comprehensive policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscription"
  ON subscriptions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update the update_user_subscription function to handle RLS
CREATE OR REPLACE FUNCTION update_user_subscription(
  p_user_id uuid,
  p_new_plan text
)
RETURNS void AS $$
DECLARE
  v_subscription_id uuid;
  v_new_subscription_id uuid;
  v_is_admin boolean;
BEGIN
  -- Check if the current user is an admin or the target user
  IF auth.uid() != p_user_id THEN
    SELECT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    ) INTO v_is_admin;
    
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  END IF;

  -- Get current subscription ID
  SELECT subscription_id INTO v_subscription_id
  FROM profiles
  WHERE id = p_user_id;

  -- If user has no subscription, create one
  IF v_subscription_id IS NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      p_user_id,
      p_new_plan::subscription_plan,
      'active',
      now(),
      now() + interval '1 month'
    ) RETURNING id INTO v_new_subscription_id;

    -- Update profile with new subscription
    UPDATE profiles
    SET subscription_id = v_new_subscription_id
    WHERE id = p_user_id;
  ELSE
    -- Update existing subscription
    UPDATE subscriptions
    SET 
      plan = p_new_plan::subscription_plan,
      current_period_start = now(),
      current_period_end = now() + interval '1 month',
      status = 'active',
      updated_at = now()
    WHERE id = v_subscription_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;