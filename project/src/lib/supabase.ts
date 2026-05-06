import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  file_type: string;
  file_url: string;
  tags: string[];
  uploader_id: string | null;
  uploader_name: string;
  download_count: number;
  created_at: string;
};

export type SavedResource = {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  total: number;
  time_taken: number;
  completed_at: string;
};
