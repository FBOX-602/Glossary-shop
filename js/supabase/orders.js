/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Orders & Order Items Access Layer
   ========================================================================== */

async function fetchOrdersFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data: ordersData, error: ordersErr } = await client
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersErr) {
            console.warn('Supabase fetchOrders error:', ordersErr.message);
            return null;
        }

        if (!ordersData || ordersData.length === 0) return [];

        const { data: itemsData } = await client
            .from('order_items')
            .select('*');

        const itemsByOrderId = {};
        if (itemsData) {
            itemsData.forEach(item => {
                if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
                itemsByOrderId[item.order_id].push({
                    id: item.product_id,
                    name: item.product_name,
                    variant: item.variant,
                    price: Number(item.price),
                    originalPrice: item.original_price ? Number(item.original_price) : null,
                    quantity: item.quantity
                });
            });
        }

        return ordersData.map(o => ({
            orderId: o.order_id,
            date: o.created_at,
            customer: {
                firstName: o.customer_name ? o.customer_name.split(' ')[0] : 'Customer',
                lastName: o.customer_name && o.customer_name.split(' ').length > 1 ? o.customer_name.split(' ').slice(1).join(' ') : '',
                email: o.customer_email || '',
                phone: o.customer_phone,
                address: o.customer_address,
                city: o.customer_city || 'Dhaka',
                notes: o.notes || ''
            },
            items: itemsByOrderId[o.order_id] || [],
            totals: {
                subtotal: Number(o.subtotal),
                savings: Number(o.savings || 0),
                deliveryFee: Number(o.delivery_fee),
                total: Number(o.total)
            },
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            orderStatus: o.order_status
        }));
    } catch (err) {
        console.warn('Supabase fetchOrders failed:', err);
        return null;
    }
}

async function saveOrderToSupabase(orderData) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        const orderPayload = {
            order_id: orderData.orderId,
            customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`.trim(),
            customer_phone: orderData.customer.phone,
            customer_email: orderData.customer.email || null,
            customer_address: orderData.customer.address,
            customer_city: orderData.customer.city || 'Dhaka',
            payment_method: orderData.paymentMethod || 'Cash on Delivery',
            payment_status: orderData.paymentStatus || 'Pending',
            order_status: orderData.orderStatus || 'Pending',
            subtotal: orderData.totals.subtotal,
            savings: orderData.totals.savings || 0,
            delivery_fee: orderData.totals.deliveryFee,
            total: orderData.totals.total,
            notes: orderData.customer.notes || null,
            created_at: orderData.date || new Date().toISOString()
        };

        const { error: orderErr } = await client
            .from('orders')
            .insert([orderPayload]);

        if (orderErr) {
            console.error('Supabase saveOrder error:', orderErr.message);
            return false;
        }

        // Insert Order Items
        if (orderData.items && orderData.items.length > 0) {
            const itemsPayload = orderData.items.map(item => ({
                order_id: orderData.orderId,
                product_id: item.id,
                product_name: item.name,
                variant: item.variant || 'Standard',
                price: item.price,
                original_price: item.originalPrice || null,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            }));

            const { error: itemsErr } = await client
                .from('order_items')
                .insert(itemsPayload);

            if (itemsErr) {
                console.error('Supabase saveOrderItems error:', itemsErr.message);
            }
        }

        return true;
    } catch (err) {
        console.error('Supabase saveOrder failed:', err);
        return false;
    }
}

async function updateOrderStatusInSupabase(orderId, newStatus) {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        let paymentStatus = 'Pending';
        if (newStatus === 'Delivered') paymentStatus = 'Paid';
        if (newStatus === 'Cancelled') paymentStatus = 'Cancelled';

        const { error } = await client
            .from('orders')
            .update({
                order_status: newStatus,
                payment_status: paymentStatus,
                updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId);

        if (error) {
            console.error('Supabase updateOrderStatus error:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase updateOrderStatus failed:', err);
        return false;
    }
}
