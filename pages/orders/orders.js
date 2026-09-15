/* Order Confirmation Page JS */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const orders = getOrders();
    const targetOrder = orderId ? getOrderById(orderId) : (orders.length > 0 ? orders[0] : null);

    if (!targetOrder) {
        document.getElementById('receipt-view').innerHTML = `
            <div style="text-align:center; padding:4rem;">
                <h2>No Recent Orders Found</h2>
                <a href="../../index.html" class="btn btn-primary" style="margin-top:1rem;">Start Shopping</a>
            </div>
        `;
        return;
    }

    renderOrderReceipt(targetOrder);
});

function renderOrderReceipt(order) {
    document.getElementById('receipt-order-id').textContent = order.orderId;
    document.getElementById('receipt-date').textContent = order.date;
    document.getElementById('receipt-payment-method').textContent = order.paymentMethod;
    document.getElementById('receipt-payment-status').textContent = order.paymentStatus;
    
    // Customer info
    const c = order.customer;
    document.getElementById('receipt-customer-name').textContent = `৳{c.firstName} ${c.lastName}`;
    document.getElementById('receipt-customer-phone').textContent = c.phone;
    document.getElementById('receipt-customer-address').textContent = `৳{c.address}, ${c.city} (${c.shippingSpeed || 'Express'})`;

    // Render items table
    const itemsTable = document.getElementById('receipt-items-body');
    if (itemsTable) {
        itemsTable.innerHTML = order.items.map(item => `
            <tr style="border-bottom:1px solid var(--border-light);">
                <td style="padding:0.75rem 0; display:flex; align-items:center; gap:0.75rem;">
                    <img src="${item.image}" alt="${item.name}" style="width:44px; height:44px; object-fit:contain; border-radius:6px; background:var(--bg-alt);" />
                    <div>
                        <div style="font-weight:700;">${item.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${item.variant}</div>
                    </div>
                </td>
                <td style="padding:0.75rem; text-align:center;">$${item.price.toFixed(2)}</td>
                <td style="padding:0.75rem; text-align:center; font-weight:700;">${item.quantity}</td>
                <td style="padding:0.75rem; text-align:right; font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // Totals
    document.getElementById('receipt-subtotal').textContent = `৳${order.totals.subtotal.toFixed(2)}`;
    document.getElementById('receipt-delivery').textContent = order.totals.deliveryFee === 0 ? 'FREE' : `৳${order.totals.deliveryFee.toFixed(2)}`;
    document.getElementById('receipt-grand-total').textContent = `৳${order.totals.total.toFixed(2)}`;
}

function printReceipt() {
    window.print();
}
