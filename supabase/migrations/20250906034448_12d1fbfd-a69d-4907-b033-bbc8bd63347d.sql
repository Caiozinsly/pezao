-- Delete the current admin user
DELETE FROM auth.users WHERE email = 'admin@pezao.com';

-- Create admin user with all required fields
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@pezao.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',  -- empty string instead of NULL
  '',  -- empty string instead of NULL  
  '',  -- empty string instead of NULL
  '',  -- empty string instead of NULL
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "PEZAO Admin"}',
  false,
  'authenticated',
  'authenticated'
);