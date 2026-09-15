/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Products Data Access Layer
   ========================================================================== */

async function fetchProductsFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Supabase fetchProducts error:', error.message);
            return null;
        }

        return data ? data.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            brand: p.brand || 'FreshMart',
            category: p.category_id,
            categoryName: p.category_name || '',
            description: p.description || '',
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : null,
            stock: p.stock_quantity || 0,
            inStock: p.in_stock,
            sku: p.sku || '',
            image: p.image,
            weightVariants: p.weight_variants || [],
            status: p.status || 'active',
            isFeatured: p.is_featured || false,
            isNew: p.is_new || false,
            rating: Number(p.rating || 5.0),
            reviewCount: p.review_count || 0
        })) : null;
    } catch (err) {
        console.warn('Supabase fetchProducts failed:', err);
        return null;
    }
}

async function saveProductToSupabase(p) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const payload = {
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            brand: p.brand || 'FreshMart',
            category_id: p.category,
            category_name: p.categoryName || '',
            description: p.description || '',
            price: p.price,
            original_price: p.originalPrice || null,
            stock_quantity: p.stock || 0,
            in_stock: p.inStock,
            sku: p.sku || '',
            image: p.image,
            weight_variants: p.weightVariants || [],
            status: p.status || 'active',
            is_featured: p.isFeatured || false,
            is_new: p.isNew || false,
            rating: p.rating || 5.0,
            review_count: p.reviewCount || 0,
            updated_at: new Date().toISOString()
        };

        const { error } = await client
            .from('products')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error('Supabase saveProduct error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase saveProduct failed:', err);
        return false;
    }
}

async function deleteProductFromSupabase(pId) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const { error } = await client
            .from('products')
            .delete()
            .eq('id', pId);

        if (error) {
            console.error('Supabase deleteProduct error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase deleteProduct failed:', err);
        return false;
    }
}
