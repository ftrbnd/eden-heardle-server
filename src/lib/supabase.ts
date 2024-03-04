import { env } from '../utils/env';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export default supabase;
