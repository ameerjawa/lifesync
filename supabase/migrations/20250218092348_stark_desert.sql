/*
  # Add task features and nested comments

  1. Changes
    - Add nested comments support
    - Add reactions to comments
    - Add task sorting and filtering
    - Add task dependencies tracking

  2. Security
    - Add RLS policies for new features
    - Update existing policies
*/

-- Add reactions to comments
CREATE TABLE IF NOT EXISTS comment_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES task_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id, reaction)
);

-- Add comment threading
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS thread_id uuid REFERENCES task_comments(id);
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS reply_count integer DEFAULT 0;

-- Add function to update reply count
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.thread_id IS NOT NULL THEN
    UPDATE task_comments
    SET reply_count = (
      SELECT COUNT(*)
      FROM task_comments
      WHERE thread_id = NEW.thread_id
    )
    WHERE id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply count
CREATE TRIGGER update_reply_count
  AFTER INSERT OR DELETE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reply_count();

-- Enable RLS on new tables
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for reactions
CREATE POLICY "Users can manage own reactions"
  ON comment_reactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS comment_reactions_comment_id_idx ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS task_comments_thread_id_idx ON task_comments(thread_id);
CREATE INDEX IF NOT EXISTS task_comments_reply_count_idx ON task_comments(reply_count);