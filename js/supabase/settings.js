/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Website Settings & Contact Layer
   ========================================================================== */

async function fetchSettingsFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('settings')
            .select('*')
            .eq('id', 'global_settings')
            .single();

        if (error) {
            console.warn('Supabase fetchSettings error:', error.message);
            return null;
        }

        if (!data) return null;

        return {
            siteName: data.site_name || 'FreshMart',
            currency: data.currency || '৳',
            freeDeliveryThreshold: Number(data.free_delivery_threshold || 1000),
            deliveryFee: Number(data.delivery_fee || 60),
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            email: data.email || '',
            address: data.address || '',
            businessHours: data.business_hours || '',
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            twitter: data.twitter || '',
            adminPassword: data.admin_password || 'admin123'
        };
    } catch (err) {
        console.warn('Supabase fetchSettings failed:', err);
        return null;
    }
}

async function saveSettingsToSupabase(s) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const payload = {
            id: 'global_settings',
            site_name: s.siteName || 'FreshMart',
            currency: s.currency || '৳',
            free_delivery_threshold: s.freeDeliveryThreshold || 1000,
            delivery_fee: s.deliveryFee || 60,
            phone: s.phone || '',
            whatsapp: s.whatsapp || '',
            email: s.email || '',
            address: s.address || '',
            business_hours: s.businessHours || '',
            facebook: s.facebook || '',
            instagram: s.instagram || '',
            twitter: s.twitter || '',
            admin_password: s.adminPassword || 'admin123',
            updated_at: new Date().toISOString()
        };

        const { error } = await client
            .from('settings')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error('Supabase saveSettings error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase saveSettings failed:', err);
        return false;
    }
}
