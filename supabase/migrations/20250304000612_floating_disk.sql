-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view plan features" ON plan_features;

-- Create comprehensive policies for plan features
CREATE POLICY "Anyone can view plan features"
  ON plan_features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage plan features"
  ON plan_features FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;