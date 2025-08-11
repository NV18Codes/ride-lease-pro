# Admin Panel Setup Guide

This guide will help you set up the complete admin system for RideLease Pro, including database setup, admin user creation, and configuration.

## 🗄️ Database Setup

### Step 1: Run the Admin System Migration

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_migrations/add_admin_system.sql`
4. Run the script

This will create:
- `admin_roles` table with predefined roles
- `admin_users` table for admin user management
- `admin_audit_logs` table for tracking admin actions
- Required functions and triggers
- Row Level Security (RLS) policies

### Step 2: Create Your First Admin User

After running the migration, you need to create your first admin user:

1. **Get your user ID from auth.users table:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. **Insert yourself as a super admin:**
   ```sql
   INSERT INTO admin_users (user_id, role_id) VALUES 
   ('YOUR_USER_UUID_HERE', (SELECT id FROM admin_roles WHERE name = 'super_admin'));
   ```

3. **Verify the setup:**
   ```sql
   SELECT 
     au.id,
     au.is_active,
     ar.name as role_name,
     u.email
   FROM admin_users au
   JOIN admin_roles ar ON au.role_id = ar.id
   JOIN auth.users u ON au.user_id = u.id;
   ```

## 👤 Admin Roles and Permissions

### Available Roles:

1. **Super Admin** (`super_admin`)
   - Full access to all features
   - Can manage other admin users
   - All permissions enabled

2. **Administrator** (`admin`)
   - Vehicle management
   - Booking management
   - Payment tracking
   - User management

3. **Moderator** (`moderator`)
   - Vehicle management
   - Booking management
   - Limited access

### Permission Structure:
```json
{
  "vehicles": true,      // Can manage vehicles
  "bookings": true,      // Can manage bookings
  "payments": true,      // Can view payment data
  "users": true,         // Can manage users
  "admin_users": true,   // Can manage admin users (super admin only)
  "all": true           // Super admin flag
}
```

## 🔐 Authentication Flow

### How Admin Login Works:

1. **User submits credentials** → AdminLogin component
2. **Supabase authentication** → Validates email/password
3. **Admin status check** → Queries admin_users table
4. **Permission verification** → Checks role permissions
5. **Access granted/denied** → Redirects to dashboard or shows error

### Security Features:

- **Row Level Security (RLS)** on all admin tables
- **Admin-only access** to sensitive operations
- **Audit logging** for all admin actions
- **Session management** with automatic logout
- **Permission-based access control**

## 🚀 Quick Start

### 1. Create Admin User Account

First, create a regular user account through the normal signup process:

```bash
# Go to your app and sign up with admin@ridelease.com
# Or use the existing user you want to make admin
```

### 2. Run Database Migration

```sql
-- Run the complete migration script
-- This creates all necessary tables and functions
```

### 3. Grant Admin Privileges

```sql
-- Make your user an admin
INSERT INTO admin_users (user_id, role_id) VALUES 
('your-user-uuid', (SELECT id FROM admin_roles WHERE name = 'super_admin'));
```

### 4. Test Admin Access

1. Go to `/admin/login`
2. Login with your credentials
3. You should be redirected to `/admin/dashboard`
4. Check that all admin features are accessible

## 🛠️ Admin Features

### Available Admin Pages:

1. **Dashboard** (`/admin/dashboard`)
   - Overview statistics
   - Recent activities
   - Quick actions

2. **Vehicle Management** (`/admin/vehicles`)
   - Add/edit/delete vehicles
   - Vehicle status management
   - Search and filtering

3. **Payment Tracking** (`/admin/payments`)
   - Payment status monitoring
   - Real-time updates
   - Payment analytics

### Admin Actions Logged:

- Vehicle creation/modification/deletion
- Booking status changes
- Payment updates
- Admin user management
- System configuration changes

## 🔧 Troubleshooting

### Common Issues:

1. **"Access denied. Admin privileges required"**
   - User is authenticated but not in admin_users table
   - Solution: Add user to admin_users table

2. **Admin dashboard not loading**
   - Check if user has valid admin role
   - Verify RLS policies are working
   - Check browser console for errors

3. **Permission errors**
   - Verify role permissions in admin_roles table
   - Check if user's role is active
   - Ensure proper role assignment

### Debug Commands:

```sql
-- Check admin user status
SELECT 
  au.id,
  au.is_active,
  ar.name as role_name,
  u.email,
  au.last_login
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
JOIN auth.users u ON au.user_id = u.id;

-- Check permissions for specific user
SELECT 
  u.email,
  ar.name as role_name,
  ar.permissions
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'admin@ridelease.com';

-- View recent admin actions
SELECT 
  al.action,
  al.table_name,
  al.created_at,
  u.email as admin_email
FROM admin_audit_logs al
JOIN admin_users au ON al.admin_user_id = au.id
JOIN auth.users u ON au.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 10;
```

## 📱 Admin Panel Usage

### Adding New Admin Users:

1. **Create regular user account** first
2. **Add to admin_users table:**
   ```sql
   INSERT INTO admin_users (user_id, role_id) VALUES 
   ('new-user-uuid', (SELECT id FROM admin_roles WHERE name = 'admin'));
   ```

### Managing Permissions:

1. **Update role permissions:**
   ```sql
   UPDATE admin_roles 
   SET permissions = '{"vehicles": true, "bookings": true, "payments": false}'
   WHERE name = 'moderator';
   ```

2. **Change user role:**
   ```sql
   UPDATE admin_users 
   SET role_id = (SELECT id FROM admin_roles WHERE name = 'admin')
   WHERE user_id = 'user-uuid';
   ```

## 🔒 Security Best Practices

1. **Use strong passwords** for admin accounts
2. **Limit admin access** to necessary personnel only
3. **Regular audit reviews** of admin actions
4. **Monitor login attempts** and suspicious activities
5. **Use role-based access** instead of giving everyone super admin
6. **Regular permission reviews** and updates

## 📊 Monitoring and Analytics

### Admin Dashboard Metrics:

- Total vehicles in fleet
- Active bookings count
- Revenue statistics
- User registration trends
- System performance metrics

### Audit Trail:

- All admin actions are logged
- Timestamp and user tracking
- Before/after value changes
- IP address and user agent logging

## 🚨 Emergency Access

### If you lose admin access:

1. **Direct database access** through Supabase dashboard
2. **Reset admin user status:**
   ```sql
   UPDATE admin_users 
   SET is_active = true 
   WHERE user_id = 'your-user-uuid';
   ```

3. **Verify role assignment:**
   ```sql
   SELECT role_id FROM admin_users WHERE user_id = 'your-user-uuid';
   ```

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify database setup is complete
3. Check admin user permissions
4. Review RLS policies
5. Ensure proper role assignments

The admin system is now fully integrated with your database and provides secure, role-based access control for managing your RideLease Pro application.
