/*
  # Add Health Tracking Tables

  1. New Tables
    - `health_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `metric_type` (text, enum)
      - `value` (numeric)
      - `recorded_at` (timestamptz)
      - `notes` (text, optional)

    - `health_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `metric_type` (text, enum)
      - `target_value` (numeric)
      - `current_value` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (text, enum)
      - Timestamps (created_at, updated_at)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enum types for metric types and goal status
CREATE TYPE health_metric_type AS ENUM (
  'weight',
  'steps',
  'sleep',
  'water',
  'mood',
  'exercise',
  'heart_rate',
  'blood_pressure'
);

CREATE TYPE health_goal_status AS ENUM (
  'active',
  'completed',
  'abandoned'
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  metric_type health_metric_type NOT NULL,
  value numeric NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create health_goals table
CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  metric_type health_metric_type NOT NULL,
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0 NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status health_goal_status DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for health_metrics
CREATE POLICY "Users can view own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for health_goals
CREATE POLICY "Users can view own health goals"
  ON health_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health goals"
  ON health_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health goals"
  ON health_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health goals"
  ON health_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX health_metrics_user_id_idx ON health_metrics(user_id);
CREATE INDEX health_metrics_metric_type_idx ON health_metrics(metric_type);
CREATE INDEX health_metrics_recorded_at_idx ON health_metrics(recorded_at);
CREATE INDEX health_goals_user_id_idx ON health_goals(user_id);
CREATE INDEX health_goals_metric_type_idx ON health_goals(metric_type);
CREATE INDEX health_goals_status_idx ON health_goals(status);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for health_goals updated_at
CREATE TRIGGER set_health_goals_updated_at
  BEFORE UPDATE ON health_goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();