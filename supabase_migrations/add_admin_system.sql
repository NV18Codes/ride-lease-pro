-- Database Migration: Add Admin System and Admin-Specific Tables
-- Run this script in your Supabase SQL editor

-- 1. Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create admin_audit_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default admin role
INSERT INTO admin_roles (name, description, permissions) VALUES 
('super_admin', 'Super Administrator with full access', '{"all": true}'),
('admin', 'Administrator with management access', '{"vehicles": true, "bookings": true, "payments": true, "users": true}'),
('moderator', 'Moderator with limited access', '{"vehicles": true, "bookings": true}')
ON CONFLICT (name) DO NOTHING;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);

-- 6. Create RLS policies for admin tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin roles policies (only admins can view)
CREATE POLICY "Admin roles are viewable by admin users" ON admin_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON au.user_id = u.id
      WHERE u.id = auth.uid() AND au.is_active = true
    )
  );

-- Admin users policies (only admins can view)
CREATE POLICY "Admin users are viewable by admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON au.user_id = u.id
      WHERE u.id = auth.uid() AND au.is_active = true
    )
  );

-- Admin audit logs policies (only admins can view)
CREATE POLICY "Admin audit logs are viewable by admin users" ON admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON au.user_id = u.id
      WHERE u.id = auth.uid() AND au.is_active = true
    )
  );

-- 7. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = user_uuid AND au.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to get admin role
CREATE OR REPLACE FUNCTION get_admin_role(user_uuid UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT ar.name FROM admin_users au
    JOIN admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = user_uuid AND au.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_name VARCHAR(100),
  table_name VARCHAR(100) DEFAULT NULL,
  record_id UUID DEFAULT NULL,
  old_vals JSONB DEFAULT NULL,
  new_vals JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_audit_logs (
    admin_user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    (SELECT id FROM admin_users WHERE user_id = auth.uid() AND is_active = true),
    action_name,
    table_name,
    record_id,
    old_vals,
    new_vals
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Add admin-specific columns to existing tables if needed
-- Add created_by and updated_by to bikes table
ALTER TABLE bikes 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);

-- Add created_by and updated_by to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);

-- 11. Create triggers for admin audit logging
CREATE OR REPLACE FUNCTION bikes_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_admin_action('CREATE', 'bikes', NEW.id, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_action('UPDATE', 'bikes', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_admin_action('DELETE', 'bikes', OLD.id, to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bookings_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_admin_action('CREATE', 'bookings', NEW.id, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_action('UPDATE', 'bookings', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_admin_action('DELETE', 'bookings', OLD.id, to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS bikes_audit_trigger ON bikes;
CREATE TRIGGER bikes_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bikes
  FOR EACH ROW EXECUTE FUNCTION bikes_audit_trigger();

DROP TRIGGER IF EXISTS bookings_audit_trigger ON bookings;
CREATE TRIGGER bookings_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION bookings_audit_trigger();

-- 12. Insert a default admin user (you'll need to replace with actual user ID from your auth.users table)
-- First, get your user ID from auth.users table, then run this:
-- INSERT INTO admin_users (user_id, role_id) VALUES 
-- ('YOUR_USER_UUID_HERE', (SELECT id FROM admin_roles WHERE name = 'super_admin'));

-- 13. Verify the setup
SELECT 
  'Admin Roles' as table_name,
  COUNT(*) as record_count
FROM admin_roles
UNION ALL
SELECT 
  'Admin Users' as table_name,
  COUNT(*) as record_count
FROM admin_users
UNION ALL
SELECT 
  'Admin Audit Logs' as table_name,
  COUNT(*) as record_count
FROM admin_audit_logs;

-- 14. Show admin functions
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname IN ('is_admin_user', 'get_admin_role', 'log_admin_action');
