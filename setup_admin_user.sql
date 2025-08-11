-- Setup Admin User Script
-- Run this AFTER running the main admin system migration
-- Replace 'your-email@example.com' with your actual email

-- Step 1: Find your user ID
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 2: Copy the user_id from above and use it in this INSERT statement
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from step 1

-- INSERT INTO admin_users (user_id, role_id) VALUES 
-- ('YOUR_USER_UUID_HERE', (SELECT id FROM admin_roles WHERE name = 'super_admin'));

-- Step 3: Verify the setup
SELECT 
  au.id as admin_user_id,
  au.is_active,
  ar.name as role_name,
  ar.description as role_description,
  u.email,
  au.created_at as admin_created_at,
  au.last_login
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
JOIN auth.users u ON au.user_id = u.id;

-- Step 4: Test admin functions
SELECT 
  is_admin_user() as current_user_is_admin,
  get_admin_role() as current_user_role;

-- Step 5: Check permissions
SELECT 
  u.email,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'your-email@example.com';
