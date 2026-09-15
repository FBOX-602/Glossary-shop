/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Project Credentials & Configuration
   Project ID: hlrmvpbpqcjcmgithaff
   ========================================================================== */

const savedSupabaseAnonKey = (typeof localStorage !== 'undefined') ? localStorage.getItem('freshmart_supabase_anon_key') : null;

const SUPABASE_CONFIG = {
    url: 'https://hlrmvpbpqcjcmgithaff.supabase.co',
    // Publishable / Anon Key (Safe for client-side browser usage)
    anonKey: savedSupabaseAnonKey || 'sb_publishable_45egRwOIQmQWmZ0Cr_rm2A_Adrj1kmx'
};

if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
