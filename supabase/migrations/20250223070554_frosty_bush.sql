-- Check if goals table exists and create if it doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'goals') THEN
    -- Create goals table
    CREATE TABLE goals (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      title text NOT NULL,
      description text,
      category text CHECK (category IN ('tasks', 'health', 'finance')) NOT NULL,
      target_date date NOT NULL,
      status text CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
      progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      milestones text[] DEFAULT '{}',
      reminder_frequency text CHECK (reminder_frequency IN ('daily', 'weekly', 'monthly', 'none')) DEFAULT 'weekly',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view own goals"
      ON goals FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can create own goals"
      ON goals FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own goals"
      ON goals FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own goals"
      ON goals FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    -- Create indexes
    CREATE INDEX goals_user_id_idx ON goals(user_id);
    CREATE INDEX goals_category_idx ON goals(category);
    CREATE INDEX goals_status_idx ON goals(status);
    CREATE INDEX goals_target_date_idx ON goals(target_date);

    -- Create trigger for updated_at
    CREATE TRIGGER set_goals_updated_at
      BEFORE UPDATE ON goals
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;