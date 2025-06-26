/*
  # Create events table for calendar application

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, required)
      - `color` (text, required)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `events` table
    - Add policies for authenticated users to manage their own events
    - Users can only view, insert, update, and delete their own events

  3. Constraints
    - Foreign key constraint linking user_id to auth.users
    - Cascade delete when user is deleted
*/

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_start_time_idx ON public.events(start_time);
CREATE INDEX IF NOT EXISTS events_end_time_idx ON public.events(end_time);