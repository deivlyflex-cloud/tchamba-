import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Production Supabase project credentials for Tchemba
const DEFAULT_SUPABASE_URL = 'https://elwfajxbudpksjylyivk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_bYJ5QbqNO_ddzM2JLb8qLA_AKiKLNAo';

// Safe extraction of Supabase URL and Anon Key from environment or runtime config
const getSupabaseEnv = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check if saved in localStorage for easy configuration from the UI without rebuild
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('tchemba_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('tchemba_supabase_anon_key') : null;

  const url = (storedUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const key = (storedKey || envKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  const isConfigured = Boolean(
    url &&
    key &&
    !url.includes('your-project') &&
    !key.includes('your-anon-key')
  );

  return {
    url,
    key,
    isConfigured,
  };
};

let clientInstance: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  if (!clientInstance || currentUrl !== url || currentKey !== key) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    currentUrl = url;
    currentKey = key;
  }

  return clientInstance;
};

export const isSupabaseReady = (): boolean => {
  return getSupabaseEnv().isConfigured;
};

export const getSupabaseConfig = () => {
  return getSupabaseEnv();
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tchemba_supabase_url', url.trim());
    localStorage.setItem('tchemba_supabase_anon_key', key.trim());
    clientInstance = null; // force re-instantiation
  }
};
