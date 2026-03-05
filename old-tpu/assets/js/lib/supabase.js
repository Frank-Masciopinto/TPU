/**
 * Supabase Client Configuration
 * 
 * This client is used for authentication (Google OAuth) on the storefront.
 * 
 * SETUP REQUIRED:
 * 1. Replace SUPABASE_URL with your project URL from Supabase Dashboard → Settings → API
 * 2. Replace SUPABASE_ANON_KEY with your anon/public key from the same page
 */

import { createClient } from '@supabase/supabase-js';

// =============================================================================
// CONFIGURATION - Replace these with your actual values
// =============================================================================

const SUPABASE_URL = 'https://jvdcfxmafgjlsrnnvcdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZGNmeG1hZmdqbHNybm52Y2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDIyNzYsImV4cCI6MjA4Mzk3ODI3Nn0.HRLrEgvlhAtUs51abOBPHSwlPWtSMhIyGuNxnXfUCaU';

// =============================================================================
// CLIENT INITIALIZATION
// =============================================================================

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Store session in localStorage
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// =============================================================================
// AUTH HELPERS
// =============================================================================

/**
 * Sign in with Google OAuth
 * Redirects to Google, then back to the specified URL
 */
export async function signInWithGoogle(redirectTo = '/account.php') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${redirectTo}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    return null;
  }
  return session;
}

/**
 * Get the current user
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Get user error:', error);
    return null;
  }
  return user;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// =============================================================================
// LOCALHOST AUTO-LOGIN (Development Only)
// =============================================================================

/**
 * Auto-login for local development
 * Only runs on localhost - automatically signs in with dev credentials
 */
export async function autoLoginDev() {
  // Only run on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (!isLocalhost) {
    return null;
  }

  // Check if already logged in
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log('[Dev] Already logged in as:', session.user?.email);
    return session;
  }

  // Dev credentials
  const DEV_EMAIL = 'ermascio@gmail.com';
  const DEV_PASSWORD = 'developer92';

  console.log('[Dev] Auto-logging in on localhost...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    });

    if (error) {
      console.error('[Dev] Auto-login failed:', error.message);
      return null;
    }

    console.log('[Dev] Auto-login successful:', data.user?.email);
    return data.session;
  } catch (err) {
    console.error('[Dev] Auto-login error:', err);
    return null;
  }
}

// Run auto-login on module load (only on localhost)
if (typeof window !== 'undefined') {
  autoLoginDev();
}

export default supabase;

