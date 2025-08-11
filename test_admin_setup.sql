-- Test Admin System Setup
-- Run this script to verify your admin system is working correctly

-- 1. Check if admin tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name IN ('admin_roles', 'admin_users', 'admin_audit_logs')
ORDER BY table_name;

-- 2. Check admin roles
SELECT 
  id,
  name,
  description,
  permissions
FROM admin_roles
ORDER BY name;

-- 3. Check admin users (should be empty initially)
SELECT 
  au.id,
  au.user_id,
  au.is_active,
  ar.name as role_name,
  au.created_at
FROM admin_users au
LEFT JOIN admin_roles ar ON au.role_id = ar.id;

-- 4. Check if admin functions exist
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname IN ('is_admin_user', 'get_admin_role', 'log_admin_action');

-- 5. Test admin functions (should return false/null for non-admin users)
SELECT 
  is_admin_user() as current_user_is_admin,
  get_admin_role() as current_user_role;

-- 6. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('admin_roles', 'admin_users', 'admin_audit_logs');

-- 7. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- 8. Check for any existing users in auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users
LIMIT 5;

-- 9. If you have users, you can test making one an admin:
-- Replace 'your-email@example.com' with an actual email from your auth.users table
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 10. After setting up an admin user, test the functions again:
-- SELECT 
--   is_admin_user() as current_user_is_admin,
--   get_admin_role() as current_user_role;
