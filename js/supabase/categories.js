/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Category Data Access Layer
   ========================================================================== */

async function fetchCategoriesFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.warn('Supabase fetchCategories error:', error.message);
            return null;
        }

        return data ? data.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            icon: c.icon || '',
            status: c.status || 'active',
            displayOrder: c.display_order || 0
        })) : null;
    } catch (err) {
        console.warn('Supabase fetchCategories failed:', err);
        return null;
    }
}

async function saveCategoryToSupabase(cat) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const payload = {
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.id,
            description: cat.description || '',
            icon: cat.icon || '',
            status: cat.status || 'active',
            display_order: cat.displayOrder || 0,
            updated_at: new Date().toISOString()
        };

        const { error } = await client
            .from('categories')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error('Supabase saveCategory error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase saveCategory failed:', err);
        return false;
    }
}

async function deleteCategoryFromSupabase(catId) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const { error } = await client
            .from('categories')
            .delete()
            .eq('id', catId);

        if (error) {
            console.error('Supabase deleteCategory error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase deleteCategory failed:', err);
        return false;
    }
}
