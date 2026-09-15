/* Admin Customer Management JS */
document.addEventListener('DOMContentLoaded', () => {
    renderCustomersList();
});

function renderCustomersList() {
    const customers = getCustomersDB();
    const container = document.getElementById('customers-table-body');
    if (!container) return;

    const searchVal = document.getElementById('search-customer') ? document.getElementById('search-customer').value.trim().toLowerCase() : '';

    let filtered = customers;
    if (searchVal) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchVal) || 
            c.phone.includes(searchVal) || 
            c.email.toLowerCase().includes(searchVal)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No customers recorded yet.</td></tr>';
        return;
    }

    container.innerHTML = filtered.map(c => `
        <tr>
            <td style="display:flex; align-items:center; gap:0.75rem;">
                <div class="cust-avatar">${c.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="font-weight:700;">${c.name}</div>
                    <div style="font-size:0.75rem; color:var(--admin-muted);">${c.email}</div>
                </div>
            </td>
            <td>${c.phone}</td>
            <td style="font-size:0.85rem;">${c.address || 'Dhaka, Bangladesh'}</td>
            <td><span class="badge-status status-confirmed">${c.totalOrders || 1} Orders</span></td>
            <td><strong class="text-primary">৳${(c.totalSpent || 0).toFixed(2)}</strong></td>
            <td>
                <button onclick="viewCustomerHistory('${c.phone}')" class="btn-admin btn-admin-outline btn-admin-sm"><i class="fas fa-history"></i> Order History</button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerHistory(phone) {
    const orders = getOrders();
    const custOrders = orders.filter(o => o.customer && o.customer.phone === phone);

    const modalBody = document.getElementById('cust-history-body');
    if (!modalBody) return;

    if (custOrders.length === 0) {
        modalBody.innerHTML = '<p style="text-align:center; color:var(--admin-muted);">No orders found for this customer phone number.</p>';
    } else {
        modalBody.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>ITEMS</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    ${custOrders.map(o => `
                        <tr>
                            <td><strong>${o.orderId}</strong></td>
                            <td>${o.date}</td>
                            <td>${o.items ? o.items.length : 0} items</td>
                            <td>৳${o.totals ? o.totals.total.toFixed(2) : '0.00'}</td>
                            <td><span class="badge-status status-${(o.orderStatus || 'pending').toLowerCase()}">${o.orderStatus}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    document.getElementById('cust-history-modal').classList.add('active');
}

function closeCustomerHistoryModal() {
    document.getElementById('cust-history-modal').classList.remove('active');
}
