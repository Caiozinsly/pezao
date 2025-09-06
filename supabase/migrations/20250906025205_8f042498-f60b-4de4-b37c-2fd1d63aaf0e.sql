-- Create admin user directly in auth.users
-- Note: This is just for demonstration. In production, create users through the auth signup flow

-- Insert admin user into auth.users
-- Password will be: admin123
-- Email: admin@pezao.com
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
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@pezao.com',
  '$2a$10$XoaZK5LGvb.z9uB6qY2aDuKZ9z6lf7DwXdY4w5.yWdZMhG7YsP8se', -- bcrypt hash of 'admin123'
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "PEZÃO Admin"}',
  false,
  'authenticated'
);