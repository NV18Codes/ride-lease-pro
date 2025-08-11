import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../integrations/supabase/client';

export interface AdminUser {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  roles?: {
    name: string;
    description: string;
    permissions: any;
  };
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  // Check if current user is admin by querying the database
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select(`
          *,
          roles:admin_roles(name, description, permissions)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      console.log('Admin query result:', { adminData, adminError });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setIsAdmin(false);
        setAdminUser(null);
        setAdminRole(null);
        return;
      }

      if (adminData) {
        console.log('User is admin:', adminData);
        setIsAdmin(true);
        setAdminUser(adminData);
        setAdminRole(adminData.roles?.name || null);
        
        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminData.id);
      } else {
        console.log('User is not admin');
        setIsAdmin(false);
        setAdminUser(null);
        setAdminRole(null);
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
      setAdminUser(null);
      setAdminRole(null);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus(user.id);
    } else {
      setIsAdmin(false);
      setAdminUser(null);
      setAdminRole(null);
    }
    setIsLoading(false);
  }, [user]);

  const adminLogin = async (email: string, password: string) => {
    try {
      // First, authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Check if the authenticated user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select(`
            *,
            roles:admin_roles(name, description, permissions)
          `)
          .eq('user_id', authData.user.id)
          .eq('is_active', true)
          .single();

        if (adminError || !adminData) {
          // User is authenticated but not an admin
          await supabase.auth.signOut();
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }

        // User is authenticated and is an admin
        return { 
          success: true, 
          user: authData.user,
          adminData: adminData 
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const hasPermission = (permission: string) => {
    if (!adminUser?.roles?.permissions) return false;
    
    const permissions = adminUser.roles.permissions;
    
    // Super admin has all permissions
    if (permissions.all === true) return true;
    
    // Check specific permission
    return permissions[permission] === true;
  };

  return {
    isAdmin,
    isLoading,
    adminUser,
    adminRole,
    adminLogin,
    hasPermission,
    checkAdminStatus
  };
};
