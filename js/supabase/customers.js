/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Customer Management Access Layer
   ========================================================================== */

async function fetchCustomersFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Supabase fetchCustomers error:', error.message);
            return null;
        }

        return data ? data.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email || '',
            phone: c.phone,
            address: c.address || '',
            totalOrders: c.total_orders || 0,
            totalSpent: Number(c.total_spent || 0),
            lastOrderDate: c.last_order_date
        })) : null;
    } catch (err) {
        console.warn('Supabase fetchCustomers failed:', err);
        return null;
    }
}

async function saveCustomerToSupabase(c) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const payload = {
            id: c.id || `cust-${Date.now()}`,
            name: c.name,
            email: c.email || null,
            phone: c.phone,
            address: c.address || '',
            total_orders: c.totalOrders || 1,
            total_spent: c.totalSpent || 0,
            last_order_date: c.lastOrderDate || new Date().toISOString()
        };

        const { error } = await client
            .from('customers')
            .upsert(payload, { onConflict: 'phone' });

        if (error) {
            console.error('Supabase saveCustomer error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase saveCustomer failed:', err);
        return false;
    }
}
