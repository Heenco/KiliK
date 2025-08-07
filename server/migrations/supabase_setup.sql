# Supabase Database Migration
# Run this in your Supabase SQL Editor

-- Create report_files table
CREATE TABLE IF NOT EXISTS report_files (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster user-based queries
CREATE INDEX IF NOT EXISTS report_files_user_id_idx ON report_files(user_id);

-- Set up Row Level Security policies
ALTER TABLE report_files ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own files
CREATE POLICY "Users can view their own files"
  ON report_files
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own files
CREATE POLICY "Users can insert their own files"
  ON report_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own files
CREATE POLICY "Users can update their own files"
  ON report_files
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own files
CREATE POLICY "Users can delete their own files"
  ON report_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create Supabase storage bucket if it doesn't exist
-- Note: This needs to be done through the Supabase dashboard or API, not SQL
-- The following is a comment for manual setup:
/*
1. Go to Storage in Supabase dashboard
2. Create a new bucket named 'inspection-reports'
3. Set the bucket to private
4. Configure CORS if needed
5. Set up the following policies:

For SELECT (download):
(bucket_id = 'inspection-reports'::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)

For INSERT (upload):
(bucket_id = 'inspection-reports'::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)

For DELETE:
(bucket_id = 'inspection-reports'::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)
*/
