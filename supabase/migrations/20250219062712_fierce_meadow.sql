/*
  # Fix Health Metrics Policies and Error Handling

  1. Changes
    - Add comprehensive RLS policies for health metrics
    - Add helper function for health metric validation
    - Add proper error handling
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own health metrics" ON health_metrics;
DROP POLICY IF EXISTS "Users can insert own health metrics" ON health_metrics;
DROP POLICY IF EXISTS "Users can update own health metrics" ON health_metrics;
DROP POLICY IF EXISTS "Users can delete own health metrics" ON health_metrics;

-- Create comprehensive policies
CREATE POLICY "Users can view own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to validate health metric values
CREATE OR REPLACE FUNCTION validate_health_metric(
  p_metric_type health_metric_type,
  p_value numeric
) RETURNS boolean AS $$
BEGIN
  -- Validate metric values based on type
  CASE p_metric_type
    WHEN 'weight' THEN
      -- Weight in kg (20-500 kg range)
      IF p_value < 20 OR p_value > 500 THEN
        RETURN false;
      END IF;
    WHEN 'steps' THEN
      -- Steps (0-100000 range)
      IF p_value < 0 OR p_value > 100000 THEN
        RETURN false;
      END IF;
    WHEN 'sleep' THEN
      -- Sleep in hours (0-24 range)
      IF p_value < 0 OR p_value > 24 THEN
        RETURN false;
      END IF;
    WHEN 'water' THEN
      -- Water in ml (0-10000 range)
      IF p_value < 0 OR p_value > 10000 THEN
        RETURN false;
      END IF;
    WHEN 'mood' THEN
      -- Mood scale (1-10 range)
      IF p_value < 1 OR p_value > 10 THEN
        RETURN false;
      END IF;
    WHEN 'exercise' THEN
      -- Exercise in minutes (0-1440 range, max 24 hours)
      IF p_value < 0 OR p_value > 1440 THEN
        RETURN false;
      END IF;
    WHEN 'heart_rate' THEN
      -- Heart rate in bpm (30-220 range)
      IF p_value < 30 OR p_value > 220 THEN
        RETURN false;
      END IF;
    WHEN 'blood_pressure' THEN
      -- Blood pressure (systolic/diastolic combined format: systolic.diastolic)
      -- Example: 120.80 represents 120/80
      IF p_value < 70.40 OR p_value > 200.120 THEN
        RETURN false;
      END IF;
  END CASE;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add health metric with validation
CREATE OR REPLACE FUNCTION add_health_metric(
  p_metric_type health_metric_type,
  p_value numeric,
  p_notes text DEFAULT NULL
)
RETURNS health_metrics AS $$
DECLARE
  v_metric health_metrics;
BEGIN
  -- Validate the metric value
  IF NOT validate_health_metric(p_metric_type, p_value) THEN
    RAISE EXCEPTION 'Invalid value for metric type %', p_metric_type;
  END IF;

  -- Insert the metric
  INSERT INTO health_metrics (
    user_id,
    metric_type,
    value,
    notes,
    recorded_at
  ) VALUES (
    auth.uid(),
    p_metric_type,
    p_value,
    p_notes,
    now()
  ) RETURNING * INTO v_metric;

  -- Update related health goals if they exist
  UPDATE health_goals
  SET current_value = p_value,
      updated_at = now(),
      status = CASE 
        WHEN p_value >= target_value THEN 'completed'::health_goal_status
        ELSE status
      END
  WHERE user_id = auth.uid()
    AND metric_type = p_metric_type
    AND status = 'active';

  RETURN v_metric;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;