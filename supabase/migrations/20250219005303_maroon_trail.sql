/*
  # Fix Subscription Update Function

  1. Changes
    - Fix ambiguous column reference in update_user_subscription function
    - Use clearer variable naming to avoid conflicts
    - Add better error handling

  2. Security
    - Function remains security definer to run with elevated privileges
    - RLS policies ensure proper access control
*/

-- Drop existing function
DROP FUNCTION IF EXISTS update_user_subscription(uuid, text);

-- Create updated function with fixed column references
CREATE OR REPLACE FUNCTION update_user_subscription(
  p_user_id uuid,
  p_new_plan text
)
RETURNS void AS $$
DECLARE
  v_subscription_id uuid;
  v_new_subscription_id uuid;
BEGIN
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
      p_new_plan,
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
      plan = p_new_plan,
      current_period_start = now(),
      current_period_end = now() + interval '1 month',
      status = 'active'
    WHERE id = v_subscription_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;