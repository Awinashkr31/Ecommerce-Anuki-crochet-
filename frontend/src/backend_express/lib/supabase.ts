import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

if (supabaseUrl === 'https://dummy.supabase.co' || supabaseServiceKey === 'dummy_key') {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Supabase client will fail on actual uploads.');
}

// Create a single supabase client for interacting with your database/storage
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
