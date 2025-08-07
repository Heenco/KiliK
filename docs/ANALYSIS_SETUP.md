# Setting Up the Analysis Feature

This guide explains how to set up the Analysis feature, which allows users to upload and manage PDF inspection reports stored in Supabase.

## Prerequisites

1. A Supabase project with authentication already set up
2. The Nuxt app is already configured with Supabase authentication

## Setup Steps

### 1. Create the Supabase Storage Bucket

1. Log in to your Supabase dashboard
2. Navigate to "Storage" in the left sidebar
3. Click "New Bucket"
4. Name the bucket `inspection-reports`
5. Set the bucket privacy to "Private"
6. Click "Create bucket"

### 2. Configure Bucket Policies

After creating the bucket, you need to set up policies to control access:

1. Click on the `inspection-reports` bucket
2. Go to the "Policies" tab
3. Create the following policies:

#### For downloading files (SELECT):
- Policy name: "Users can download their own files"
- Allowed operation: SELECT
- Policy definition: `(auth.uid() = (storage.foldername(name))[1]::uuid)`

#### For uploading files (INSERT):
- Policy name: "Users can upload their own files"
- Allowed operation: INSERT
- Policy definition: `(auth.uid() = (storage.foldername(name))[1]::uuid)`

#### For deleting files (DELETE):
- Policy name: "Users can delete their own files"
- Allowed operation: DELETE
- Policy definition: `(auth.uid() = (storage.foldername(name))[1]::uuid)`

### 3. Create the Database Table

1. Go to the "SQL Editor" in your Supabase dashboard
2. Copy and paste the contents of `server/migrations/supabase_setup.sql`
3. Run the SQL script

## How It Works

The Analysis feature:

1. Uses the user's UID to create a folder structure in the storage bucket
2. Stores PDFs in `inspection-reports/{user_id}/{filename}` 
3. Preserves original filenames while ensuring uniqueness with timestamps
4. Maintains metadata about each file in the `report_files` table
5. Provides a UI for uploading, viewing, and deleting inspection reports
6. Uses signed URLs for secure access to the PDF files

## User Experience

1. Users navigate to the Analysis page
2. They can upload PDF inspection reports directly from the Analysis page
3. The reports are securely stored in their user-specific folder
4. They can view and manage their uploaded reports
5. When viewing a PDF, a secure temporary URL is generated

## Security Features

- Row Level Security ensures users can only access their own files
- Storage bucket policies enforce user-based access control
- Signed URLs provide temporary, secure access to files
- User authentication is required to access the Analysis page
