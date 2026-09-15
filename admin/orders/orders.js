/* Admin Order Management JS */
let currentFilterStatus = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');

    renderOrdersList();
    window.addEventListener('dbUpdated', renderOrdersList);

    if (orderIdParam) {
        openOrderDetailsModal(orderIdParam);
    }
});

function setFilterStatus(btn, status) {
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilterStatus = status;
    renderOrdersList();
}

function renderOrdersList() {
    const orders = getOrders();
    const container = document.getElementById('orders-table-body');
    if (!container) return;

    const searchVal = document.getElementById('search-order') ? document.getElementById('search-order').value.trim().toLowerCase() : '';

    let filtered = orders;

    if (currentFilterStatus !== 'all') {
        filtered = filtered.filter(o => (o.orderStatus || 'pending').toLowerCase() === currentFilterStatus.toLowerCase());
    }

    if (searchVal) {
        filtered = filtered.filter(o => 
            o.orderId.toLowerCase().includes(searchVal) || 
            (o.customer && (o.customer.firstName.toLowerCase().includes(searchVal) || o.customer.phone.includes(searchVal)))
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">No orders found matching criteria.</td></tr>';
        return;
    }

    container.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>${o.orderId}</strong></td>
            <td>
                <div style="font-weight:700;">${o.customer ? o.customer.firstName + ' ' + o.customer.lastName : 'Guest'}</div>
                <div style="font-size:0.75rem; color:var(--admin-muted);">${o.customer ? o.customer.phone : ''}</div>
            </td>
            <td>
                <div style="font-size:0.8rem;">${o.paymentMethod || 'COD'}</div>
                <span class="badge-status ${o.paymentStatus === 'Paid' ? 'status-delivered' : 'status-pending'}" style="font-size:0.65rem;">
                    ${o.paymentStatus || 'Pending'}
                </span>
            </td>
            <td><strong>৳${o.totals ? o.totals.total.toFixed(2) : '0.00'}</strong></td>
            <td>
                <select class="admin-form-select" onchange="changeOrderStatus('${o.orderId}', this.value)" style="width:130px; font-size:0.8rem; padding:0.25rem 0.4rem;">
                    <option value="Pending" ${o.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td style="font-size:0.8rem; color:var(--admin-muted);">${o.date}</td>
            <td>
                <button onclick="openOrderDetailsModal('${o.orderId}')" class="btn-admin btn-admin-outline btn-admin-sm"><i class="fas fa-eye"></i> View</button>
            </td>
        </tr>
    `).join('');
}

function changeOrderStatus(orderId, newStatus) {
    const success = updateOrderStatus(orderId, newStatus);
    if (success) {
        alert(`Order ${orderId} status updated to ${newStatus}!`);
    }
}

function openOrderDetailsModal(orderId) {
    const order = getOrderById(orderId);
    if (!order) return;

    document.getElementById('modal-order-id').textContent = order.orderId;
    document.getElementById('modal-order-date').textContent = order.date;
    document.getElementById('modal-order-status-badge').textContent = order.orderStatus || 'Pending';
    document.getElementById('modal-order-status-badge').className = `badge-status status-${(order.orderStatus || 'pending').toLowerCase()}`;

    const c = order.customer;
    document.getElementById('modal-customer-info').innerHTML = `
        <div style="font-weight:700;">${c.firstName} ${c.lastName}</div>
        <div>Phone: ${c.phone}</div>
        <div>Email: ${c.email}</div>
        <div style="margin-top:0.35rem; font-size:0.85rem; color:var(--admin-muted);">Address: ${c.address}, ${c.city} (${c.shippingSpeed || 'Express'})</div>
    `;

    document.getElementById('modal-payment-info').innerHTML = `
        <div style="font-weight:700;">Method: ${order.paymentMethod || 'COD'}</div>
        <div>Status: <span class="badge-status ${order.paymentStatus === 'Paid' ? 'status-delivered' : 'status-pending'}">${order.paymentStatus || 'Pending'}</span></div>
    `;

    const itemsTable = document.getElementById('modal-order-items-body');
    itemsTable.innerHTML = order.items.map(item => `
        <tr>
            <td style="display:flex; align-items:center; gap:0.5rem;">
                <img src="${item.image}" alt="" style="width:36px; height:36px; object-fit:contain; border-radius:4px;" />
                <div>
                    <div style="font-weight:700;">${item.name}</div>
                    <div style="font-size:0.75rem; color:var(--admin-muted);">${item.variant}</div>
                </div>
            </td>
            <td>৳${item.price.toFixed(2)}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right; font-weight:700;">৳${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('modal-subtotal').textContent = `৳${order.totals.subtotal.toFixed(2)}`;
    document.getElementById('modal-delivery').textContent = order.totals.deliveryFee === 0 ? 'FREE' : `৳${order.totals.deliveryFee.toFixed(2)}`;
    document.getElementById('modal-total').textContent = `৳${order.totals.total.toFixed(2)}`;

    document.getElementById('order-details-modal').classList.add('active');
}

function closeOrderDetailsModal() {
    document.getElementById('order-details-modal').classList.remove('active');
}
