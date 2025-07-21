import { createClient } from '@supabase/supabase-js';


export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);
// const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

export default supabase;
        