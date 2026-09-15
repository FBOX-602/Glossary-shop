/* Admin Dashboard JS */
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    window.addEventListener('dbUpdated', renderDashboard);
});

function renderDashboard() {
    const products = getProductsDB();
    const categories = getCategoriesDB();
    const orders = getOrders();
    const customers = getCustomersDB();

    // Stats calculations
    let totalRevenue = 0;
    let pendingCount = 0;
    let completedCount = 0;

    orders.forEach(o => {
        if (o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered') {
            totalRevenue += o.totals ? o.totals.total : 0;
        }
        if (o.orderStatus === 'Pending' || o.orderStatus === 'Processing') {
            pendingCount++;
        }
        if (o.orderStatus === 'Delivered') {
            completedCount++;
        }
    });

    // Populate KPI cards
    document.getElementById('stat-total-revenue').textContent = `৳${totalRevenue.toFixed(2)}`;
    document.getElementById('stat-total-orders').textContent = orders.length;
    document.getElementById('stat-pending-orders').textContent = pendingCount;
    document.getElementById('stat-completed-orders').textContent = completedCount;
    document.getElementById('stat-total-products').textContent = products.length;
    document.getElementById('stat-total-categories').textContent = categories.length;
    document.getElementById('stat-total-customers').textContent = customers.length;

    // Render Recent Orders Table (latest 5)
    const recentOrdersContainer = document.getElementById('recent-orders-body');
    if (recentOrdersContainer) {
        if (orders.length === 0) {
            recentOrdersContainer.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--admin-muted);">No orders placed yet.</td></tr>';
        } else {
            recentOrdersContainer.innerHTML = orders.slice(0, 5).map(o => `
                <tr>
                    <td><strong>${o.orderId}</strong></td>
                    <td>${o.customer ? o.customer.firstName + ' ' + o.customer.lastName : 'Guest'}</td>
                    <td>৳${o.totals ? o.totals.total.toFixed(2) : '0.00'}</td>
                    <td><span class="badge-status status-${(o.orderStatus || 'pending').toLowerCase()}">${o.orderStatus || 'Pending'}</span></td>
                    <td>${o.date}</td>
                    <td>
                        <a href="../orders/index.html?orderId=${o.orderId}" class="btn-admin btn-admin-outline btn-admin-sm">Details</a>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Render Low Stock Alert Table (< 10 items)
    const lowStockContainer = document.getElementById('low-stock-body');
    if (lowStockContainer) {
        const lowStockItems = products.filter(p => p.stock <= 10 || !p.inStock);
        if (lowStockItems.length === 0) {
            lowStockContainer.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--admin-primary);"><i class="fas fa-check-circle"></i> All products sufficiently stocked!</td></tr>';
        } else {
            lowStockContainer.innerHTML = lowStockItems.map(p => `
                <tr>
                    <td style="display:flex; align-items:center; gap:0.5rem;">
                        <img src="${p.image}" alt="" style="width:32px; height:32px; object-fit:contain; border-radius:4px;" />
                        <span>${p.name}</span>
                    </td>
                    <td><span class="badge-status status-cancelled">${p.stock} left</span></td>
                    <td><a href="../products/index.html" class="btn-admin btn-admin-outline btn-admin-sm">Restock</a></td>
                </tr>
            `).join('');
        }
    }
}
