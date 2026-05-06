/*
  # Open Study Platform Schema

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text) - resource title
      - `description` (text) - optional description
      - `category` (text) - e.g., Class 11, GATE, JEE, etc.
      - `file_type` (text) - PDF, Video, Doc, etc.
      - `file_url` (text) - URL to file
      - `tags` (text[]) - array of tags
      - `uploader_id` (uuid) - references auth.users
      - `uploader_name` (text) - display name
      - `download_count` (int) - number of downloads
      - `created_at` (timestamp)
    - `saved_resources`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users
      - `resource_id` (uuid) - references resources
      - `created_at` (timestamp)
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users
      - `test_id` (text) - test identifier
      - `score` (int) - score achieved
      - `total` (int) - total questions
      - `time_taken` (int) - seconds taken
      - `completed_at` (timestamp)

  2. Security
    - RLS enabled on all tables
    - Resources: anyone can read, authenticated can insert, owners can delete
    - Saved resources: users can manage their own
    - Progress: users can manage their own
*/

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  file_url text DEFAULT '',
  tags text[] DEFAULT '{}',
  uploader_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_name text DEFAULT 'Anonymous',
  download_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Owners can update their resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploader_id)
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Owners can delete their resources"
  ON resources FOR DELETE
  TO authenticated
  USING (auth.uid() = uploader_id);

CREATE TABLE IF NOT EXISTS saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved resources"
  ON saved_resources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save resources"
  ON saved_resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave resources"
  ON saved_resources FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id text NOT NULL,
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  time_taken int DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Seed some sample resources
INSERT INTO resources (title, description, category, file_type, tags, uploader_name, download_count) VALUES
  ('Class 12 Physics - Wave Optics Notes', 'Comprehensive notes covering interference, diffraction and polarization', 'Class 12', 'PDF', '{"physics", "optics", "waves"}', 'Priya S.', 142),
  ('JEE Advanced 2023 - Math Solutions', 'Detailed solutions to all JEE Advanced 2023 mathematics questions', 'JEE', 'PDF', '{"jee", "mathematics", "solutions"}', 'Arjun K.', 389),
  ('Python for Beginners - Complete Course', 'From variables to OOP, a complete beginner Python video series', 'Programming', 'Video', '{"python", "programming", "beginners"}', 'Ravi M.', 512),
  ('GATE CS 2024 - Data Structures', 'Topic-wise solved problems on arrays, trees, graphs and sorting', 'GATE', 'PDF', '{"gate", "data structures", "algorithms"}', 'Sneha R.', 278),
  ('NEET Biology - Cell Structure Mind Maps', 'Visual mind maps for quick revision of cell biology', 'NEET', 'PDF', '{"neet", "biology", "cell"}', 'Anjali T.', 201),
  ('Class 11 Chemistry - Periodic Table', 'Complete notes on periodic trends and element properties', 'Class 11', 'PDF', '{"chemistry", "periodic table", "class11"}', 'Vikram P.', 167),
  ('CUET English Preparation Guide', 'Comprehension, grammar and vocabulary exercises for CUET', 'CUET', 'Doc', '{"cuet", "english", "grammar"}', 'Meena L.', 95),
  ('Finance Fundamentals - Balance Sheet Analysis', 'Introduction to reading and analyzing financial statements', 'Finance', 'PDF', '{"finance", "accounting", "balance sheet"}', 'Kiran B.', 134),
  ('Data Structures - Linked List Animations', 'Visual animations explaining singly and doubly linked lists', 'Programming', 'Video', '{"linked list", "data structures", "visual"}', 'Dev C.', 445),
  ('JEE Main 2024 - Physics Formulas Sheet', 'All important physics formulas compiled for JEE Main', 'JEE', 'PDF', '{"jee", "physics", "formulas"}', 'Anika S.', 623)
ON CONFLICT DO NOTHING;

-- Community Forum Tables
CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text DEFAULT 'Anonymous',
  likes int DEFAULT 0,
  comments_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum threads"
  ON forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert threads"
  ON forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their threads"
  ON forum_threads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text DEFAULT 'Anonymous',
  content text NOT NULL,
  likes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum comments"
  ON forum_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their comments"
  ON forum_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed sample forum threads
INSERT INTO forum_threads (title, content, category, author_name) VALUES
  ('Best tips for JEE 2024', 'What are your top strategies for cracking JEE 2024? Share your experiences!', 'Study Tips', 'Rohan K.'),
  ('Doubts in Organic Chemistry', 'Can someone explain reaction mechanisms? I am struggling with SN1 and SN2.', 'Help', 'Priya V.'),
  ('Recommended resources for NEET', 'Has anyone found good study materials? Please share your recommendations.', 'Resources', 'Aditya M.')
ON CONFLICT DO NOTHING;

