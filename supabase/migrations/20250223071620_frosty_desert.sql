-- Check if goals table exists and create if it doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'roads') THEN
    -- Create roads table
    CREATE TABLE roads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
      title text NOT NULL,
      description text,
      theme text CHECK (theme IN ('futuristic', 'nature', 'minimalistic')) DEFAULT 'minimalistic',
      progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create milestones table
    CREATE TABLE milestones (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      road_id uuid REFERENCES roads(id) ON DELETE CASCADE NOT NULL,
      title text NOT NULL,
      description text,
      position integer NOT NULL,
      xp_reward integer DEFAULT 0,
      is_completed boolean DEFAULT false,
      completion_date timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create badges table
    CREATE TABLE badges (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      icon_url text NOT NULL,
      xp_value integer DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );

    -- Create user_badges table
    CREATE TABLE user_badges (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
      earned_at timestamptz DEFAULT now(),
      UNIQUE(user_id, badge_id)
    );

    -- Enable RLS
    ALTER TABLE roads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
    ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can manage own roads"
      ON roads FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can manage milestones for their roads"
      ON milestones FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM roads
        WHERE roads.id = milestones.road_id
        AND roads.user_id = auth.uid()
      ));

    CREATE POLICY "Anyone can view badges"
      ON badges FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Users can view own badges"
      ON user_badges FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    -- Create indexes
    CREATE INDEX roads_user_id_idx ON roads(user_id);
    CREATE INDEX roads_goal_id_idx ON roads(goal_id);
    CREATE INDEX milestones_road_id_idx ON milestones(road_id);
    CREATE INDEX milestones_position_idx ON milestones(position);
    CREATE INDEX user_badges_user_id_idx ON user_badges(user_id);
    CREATE INDEX user_badges_badge_id_idx ON user_badges(badge_id);

    -- Create triggers
    CREATE TRIGGER set_roads_updated_at
      BEFORE UPDATE ON roads
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();

    CREATE TRIGGER set_milestones_updated_at
      BEFORE UPDATE ON milestones
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;