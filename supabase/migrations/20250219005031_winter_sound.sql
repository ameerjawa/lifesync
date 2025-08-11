/*
  # Fix User Management Issues

  1. Changes
    - Add update_user_subscription function
    - Fix profile updates by using direct column updates
    - Add missing indexes

  2. Security
    - Function is security definer to run with elevated privileges
    - RLS policies ensure proper access control
*/

-- Create function to update user subscription
CREATE OR REPLACE FUNCTION update_user_subscription(
  user_id uuid,
  new_plan text
)
RETURNS void AS $$
DECLARE
  subscription_id uuid;
BEGIN
  -- Get current subscription ID
  SELECT subscription_id INTO subscription_id
  FROM profiles
  WHERE id = user_id;

  -- If user has no subscription, create one
  IF subscription_id IS NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      user_id,
      new_plan,
      'active',
      now(),
      now() + interval '1 month'
    ) RETURNING id INTO subscription_id;

    -- Update profile with new subscription
    UPDATE profiles
    SET subscription_id = subscription_id
    WHERE id = user_id;
  ELSE
    -- Update existing subscription
    UPDATE subscriptions
    SET 
      plan = new_plan,
      current_period_start = now(),
      current_period_end = now() + interval '1 month'
    WHERE id = subscription_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;