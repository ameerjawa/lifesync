/*
  # Enhance RLS with Server-Side Admin Checks

  1. Admin Functions
    - Create helper function to check admin role
    - Server-side admin verification

  2. Security Enhancements
    - Admin bypass policies for certain tables
    - Audit logging for admin actions
    - Guest data cleanup function

  3. Notes
    - Admin checks should be server-side, not client-only
    - Consider adding audit trail for sensitive operations
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cleanup_guest_data(days_old INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can cleanup guest data';
  END IF;

  WITH deleted AS (
    DELETE FROM tasks
    WHERE guest_id IS NOT NULL
    AND created_at < NOW() - INTERVAL '1 day' * days_old
    RETURNING *
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin() IS 'Server-side function to check if current user has admin role';
COMMENT ON FUNCTION cleanup_guest_data(INTEGER) IS 'Cleanup old guest data - admin only';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all profiles' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles" ON profiles
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all subscriptions' AND tablename = 'subscriptions'
  ) THEN
    CREATE POLICY "Admins can view all subscriptions" ON subscriptions
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END$$;