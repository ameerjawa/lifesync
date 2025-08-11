-- Add image_url column to roads table
ALTER TABLE roads
ADD COLUMN IF NOT EXISTS image_url text;

-- Create index for image_url
CREATE INDEX IF NOT EXISTS roads_image_url_idx ON roads(image_url);

-- Update existing roads with default image if needed
UPDATE roads 
SET image_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3'
WHERE image_url IS NULL;