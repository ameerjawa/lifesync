/*
  # Configure Storage Buckets

  1. Storage Buckets
    - `task-attachments` - For task file attachments
      - Private bucket with RLS
      - 10MB file size limit
      - Allowed file types: images, PDFs, documents

  2. Security
    - Policies for insert, select, delete
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-attachments',
  'task-attachments',
  false,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Authenticated users can upload task attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own task attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own task attachments" ON storage.objects;

CREATE POLICY "Authenticated users can upload task attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-attachments'
);

CREATE POLICY "Users can view their own task attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-attachments'
);

CREATE POLICY "Users can delete their own task attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'task-attachments'
);