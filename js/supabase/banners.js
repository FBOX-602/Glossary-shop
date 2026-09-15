/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Banners Data Access Layer
   ========================================================================== */

async function fetchBannersFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('banners')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.warn('Supabase fetchBanners error:', error.message);
            return null;
        }

        return data ? data.map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            tag: b.tag || '',
            buttonText: b.button_text || 'Shop Now',
            link: b.link || '#',
            image: b.image,
            active: b.active,
            displayOrder: b.display_order || 0
        })) : null;
    } catch (err) {
        console.warn('Supabase fetchBanners failed:', err);
        return null;
    }
}

async function saveBannerToSupabase(b) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const payload = {
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            tag: b.tag || '',
            button_text: b.buttonText || 'Shop Now',
            link: b.link || '#',
            image: b.image,
            active: b.active,
            display_order: b.displayOrder || 0,
            updated_at: new Date().toISOString()
        };

        const { error } = await client
            .from('banners')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error('Supabase saveBanner error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase saveBanner failed:', err);
        return false;
    }
}

async function deleteBannerFromSupabase(bId) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const { error } = await client
            .from('banners')
            .delete()
            .eq('id', bId);

        if (error) {
            console.error('Supabase deleteBanner error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase deleteBanner failed:', err);
        return false;
    }
}
