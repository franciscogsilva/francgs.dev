import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

console.log('Supabase Init Check:', { 
  hasUrl: !!supabaseUrl, 
  hasKey: !!supabaseServiceKey,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 8) : 'none'
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL: Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Server-side client with service role key (full access)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
