/**
 * Supabase Client
 * 
 * Provides a centralized interface for interacting with Supabase services
 * including authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config/environment';

// For client-side usage (with anon key)
export const supabaseClient = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);

// For server-side operations requiring elevated permissions (service role key)
// This should only be used in protected API routes on the server
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

export default supabaseClient;
