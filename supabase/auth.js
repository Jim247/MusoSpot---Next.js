import { supabase } from '../supabaseClient.js';

// Sign up a new user
export async function signUpUser(email, password, userData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData },
  });
  if (error) throw error;
  return data.user;
}

// Sign in
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

// Get current user profile from users table
export async function getCurrentUser() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const authUser = authData.user;
  if (!authUser) return null;
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();
  if (profileError) throw profileError;
  return profile;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

// React hook for auth state
import { useEffect, useState } from 'react';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, signOut };
}

/**
 * Generates a unique username by checking Supabase.
 * Tries up to 5 times with a new random number if needed.
 */
export async function generateusername(first_name, last_name) {
  const base = `${first_name}${last_name}`.replace(/\s+/g, '').toLowerCase();

  for (let i = 0; i < 5; i++) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}${random}`;

    // Check if username exists in Supabase
    const { data } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (!data) {
      return username;
    }
    // else, try again
  }
  // Fallback: append a timestamp if all attempts fail
  return `${base}${Date.now()}`;
}

/**
 * Sends a password reset email using Supabase Auth.
 */
export async function sendPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

/**
 * Fetches a user's public profile by username. Returns null if not found.
 * This should be readable by public (RLS policy must allow select by username).
 */
export async function getPublicProfileByUsername(username) {
  if (!username) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  return data;
}
