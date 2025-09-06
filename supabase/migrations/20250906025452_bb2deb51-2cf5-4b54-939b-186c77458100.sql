-- Remove the incorrectly created admin user
DELETE FROM auth.users WHERE email = 'admin@pezao.com';

-- Create the admin user with correct password hash for 'admin123'
-- Using a proper bcrypt hash
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@pezao.com',
  crypt('admin123', gen_salt('bf')), -- Generate proper bcrypt hash
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "PEZÃO Admin"}',
  false,
  'authenticated',
  'authenticated'
);