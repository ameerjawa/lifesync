-- Create default admin user
DO $$ 
DECLARE 
  admin_id uuid;
BEGIN
  -- First check if admin already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@lifesync.app'
  ) THEN
    -- Create admin user in auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@lifesync.app',
      crypt('123456', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_id;

    -- Create admin profile
    INSERT INTO profiles (
      id,
      email,
      full_name,
      role,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'admin@lifesync.app',
      'System Administrator',
      'admin',
      NOW(),
      NOW()
    );
  END IF;
END $$;