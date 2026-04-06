import { User, UserProfileUpdate } from '../types';
import { supabase } from './supabaseClient';

// Mapping function to convert DB profile to App User
const mapProfileToUser = (profile: any, authUser: any): User => {
  return {
    id: authUser.id,
    email: authUser.email || '',
    fullName: profile.full_name || '',
    username: profile.username || '',
    phoneNumber: profile.phone_number || '',
    isAdmin: profile.is_admin || false,
    isVerified: profile.is_verified || false,
    balance: profile.balance || 0,
    notifications: [], // Notifications loaded separately usually
    profilePictureUrl: profile.profile_picture_url,
  };
};

export const register = async (userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string }): Promise<{ user: User | null; error?: string }> => {
  try {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.toLowerCase(), // Normalize email
      password: userData.password,
    });

    if (authError || !authData.user) {
      return { user: null, error: authError?.message || 'Registration failed.' };
    }

    const userId = authData.user.id;
    const username = userData.email.split('@')[0].toLowerCase();

    // 2. Create Profile in 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: userData.email.toLowerCase(), // Added email to profile
          full_name: userData.fullName,
          username: username,
          phone_number: userData.phoneNumber,
          is_admin: false,
          is_verified: false,
          balance: 13000000, // Default balance
        }
      ])
      .select()
      .single();

    if (profileError) {
      return { user: null, error: 'Failed to create user profile. Please contact support.' };
    }

    return { user: mapProfileToUser(profileData, authData.user) };
  } catch (e: any) {
    return { user: null, error: e.message || 'An unexpected error occurred during registration.' };
  }
};

export const login = async (identifier: string, passwordAttempt: string): Promise<{ user: User | null; error?: string }> => {
  try {
    let email = identifier;

    // If identifier is not an email, try to find the email from the profiles table using phone number
    if (!identifier.includes('@')) {
      const { data: profileByPhone } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone_number', identifier)
        .single();
      
      if (profileByPhone && profileByPhone.email) {
        email = profileByPhone.email;
      } else {
        return { user: null, error: 'User with this phone number not found.' };
      }
    }

    // 1. Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(), // Normalize email
      password: passwordAttempt,
    });

    if (authError || !authData.user) {
      return { user: null, error: authError?.message || 'Invalid login credentials' };
    }

    // 2. Fetch Profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return { user: null, error: 'Profile not found. Please contact support.' };
    }

    return { user: mapProfileToUser(profileData, authData.user) };
  } catch (e: any) {
    return { user: null, error: e.message || 'An unexpected error occurred.' };
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) return null;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profileData) return null;

  // Load notifications separately
  const { data: notifs } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false });

  const user = mapProfileToUser(profileData, session.user);
  user.notifications = notifs || [];
  
  return user;
};

export const verifyEmail = async (email: string): Promise<boolean> => {
  // In a real Supabase app, this is done via email link click.
  // Admin can verify manually.
  // For this app flow, we'll perform a DB update simulating verification if we find the email.
  
  // Find user ID by email (only possible if we have admin rights or a specific function)
  // Simplified: We can only verify the CURRENTLY logged in user or via RPC.
  // Assuming usage: Admin verifies user or user clicks link.
  // Let's simulate logic: we assume we can update the profile if we know the email.
  // Note: This is insecure on client side without RLS policies allowing it.
  
  // This functionality is tricky with Supabase client-side only security.
  // We will return true to simulate the "sent verification email" flow.
  console.log(`Verification email sent to ${email} (Simulated by Supabase flow)`);
  return true;
};

export const updateUserNotification = async (userId: string, notificationId: string, read: boolean): Promise<void> => {
  await supabase
    .from('notifications')
    .update({ read: read })
    .eq('id', notificationId)
    .eq('user_id', userId);
};

export const addUserNotification = async (userId: string, message: string): Promise<void> => {
  await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      message: message,
      date: new Date().toISOString(),
      read: false
    }]);
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', userId);
};

export const getAllUsers = async (): Promise<User[]> => {
  // Requires Admin RLS policy
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error("Error fetching all users", error);
    return [];
  }
  
  // Note: We don't have auth.users data easily for all users on client side usually.
  // We will map what we have in profiles.
  return profiles.map((p: any) => ({
    id: p.id,
    email: p.email || 'hidden@email.com', // Email might not be in profile table depending on schema
    fullName: p.full_name,
    username: p.username,
    phoneNumber: p.phone_number,
    isAdmin: p.is_admin,
    isVerified: p.is_verified,
    balance: p.balance,
    notifications: [],
    profilePictureUrl: p.profile_picture_url
  }));
};

export const updateUserInfo = async (updatedData: Partial<User>): Promise<void> => {
  if (!updatedData.id) return;
  
  const updates: any = {};
  if (updatedData.fullName) updates.full_name = updatedData.fullName;
  if (updatedData.phoneNumber) updates.phone_number = updatedData.phoneNumber;
  if (updatedData.profilePictureUrl) updates.profile_picture_url = updatedData.profilePictureUrl;
  if (updatedData.isVerified !== undefined) updates.is_verified = updatedData.isVerified;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', updatedData.id);

  if (error) throw error;
};

export const adminCreateUser = async (userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string }): Promise<{ user: User | null; error?: string }> => {
  try {
    // 1. Sign up with Supabase Auth
    // Note: In a real app, this would use the Admin API (service_role key) to avoid signing out the current admin.
    // For this demo, we use the standard signUp.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.toLowerCase(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
        }
      }
    });

    if (authError || !authData.user) {
      return { user: null, error: authError?.message || 'Registration failed.' };
    }

    const userId = authData.user.id;
    const username = userData.email.split('@')[0].toLowerCase();

    // 2. Create Profile in 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: userData.email.toLowerCase(),
          full_name: userData.fullName,
          username: username,
          phone_number: userData.phoneNumber,
          is_admin: false,
          is_verified: true, // Admin created users are verified by default
          balance: 13000000, // Default balance
        }
      ])
      .select()
      .single();

    if (profileError) {
      return { user: null, error: 'Failed to create user profile.' };
    }

    return { user: mapProfileToUser(profileData, authData.user) };
  } catch (e: any) {
    return { user: null, error: e.message || 'An unexpected error occurred.' };
  }
};
