import { createClient } from "@supabase/supabase-js";

// Ambil dari .env (lihat catatan di bawah file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);