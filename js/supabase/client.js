/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Client & Realtime Channel Manager
   ========================================================================== */

let supabaseClient = null;

function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            const config = window.SUPABASE_CONFIG || SUPABASE_CONFIG;
            supabaseClient = window.supabase.createClient(config.url, config.anonKey);
            initRealtimeSync(supabaseClient);
        } catch (err) {
            console.warn('Supabase client initialization warning:', err.message);
        }
    }
    return supabaseClient;
}

// Initialize Realtime Listeners for Supabase DB Tables
function initRealtimeSync(client) {
    if (!client || typeof client.channel !== 'function') return;

    try {
        const channel = client.channel('freshmart-db-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                console.log('Realtime DB Update [products]:', payload);
                window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'products', payload } }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
                console.log('Realtime DB Update [categories]:', payload);
                window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'categories', payload } }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, (payload) => {
                console.log('Realtime DB Update [banners]:', payload);
                window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'banners', payload } }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
                console.log('Realtime DB Update [settings]:', payload);
                window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'settings', payload } }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                console.log('Realtime DB Update [orders]:', payload);
                window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'orders', payload } }));
            })
            .subscribe();
    } catch (e) {
        console.warn('Realtime subscription error:', e);
    }
}

// Execute initial client creation if loaded
document.addEventListener('DOMContentLoaded', () => {
    getSupabaseClient();
});
