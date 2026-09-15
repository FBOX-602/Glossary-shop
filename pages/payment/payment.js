/* Payment Page JS */
let selectedMethod = 'cod';
let customerData = null;

document.addEventListener('DOMContentLoaded', () => {
    const rawCustomer = sessionStorage.getItem('freshmart_checkout_customer');
    if (!rawCustomer) {
        window.location.href = '../checkout/index.html';
        return;
    }
    customerData = JSON.parse(rawCustomer);
    renderPaymentSummary();
});

function renderPaymentSummary() {
    const cart = getCart();
    if (!cart || cart.length === 0) {
        window.location.href = '../cart/index.html';
        return;
    }

    const totals = getCartTotals();
    document.getElementById('pay-subtotal').textContent = `৳${totals.subtotal.toFixed(2)}`;
    document.getElementById('pay-delivery').textContent = totals.deliveryFee === 0 ? 'FREE' : `৳${totals.deliveryFee.toFixed(2)}`;
    document.getElementById('pay-total').textContent = `৳${totals.total.toFixed(2)}`;

    // Address Summary
    document.getElementById('pay-customer-name').textContent = `৳{customerData.firstName} ${customerData.lastName}`;
    document.getElementById('pay-customer-phone').textContent = customerData.phone;
    document.getElementById('pay-customer-address').textContent = `৳{customerData.address}, ${customerData.city}`;
}

function selectPaymentMethod(tile, methodId) {
    document.querySelectorAll('.payment-method-tile').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.payment-details-form').forEach(f => f.classList.remove('active'));

    tile.classList.add('active');
    selectedMethod = methodId;

    const form = document.getElementById(`form-৳{methodId}`);
    if (form) form.classList.add('active');
}

function processPaymentSubmission() {
    const cart = getCart();
    const totals = getCartTotals();

    // Basic Card Validation if Credit Card selected
    if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
        const cardName = document.getElementById('card-name').value.trim();
        if (cardNumber.length < 12 || !cardName) {
            showToast('Please enter valid credit card details.', 'danger');
            return;
        }
    }

    // Generate Order ID (e.g. FM-2026-84920)
    const orderId = `FM-৳{new Date().getFullYear()}-৳{Math.floor(10000 + Math.random() * 90000)}`;

    const orderRecord = {
        orderId: orderId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        customer: customerData,
        items: cart,
        totals: totals,
        paymentMethod: getMethodTitle(selectedMethod),
        paymentStatus: selectedMethod === 'cod' ? 'Pending (COD)' : 'Paid',
        orderStatus: 'Processing'
    };

    saveOrder(orderRecord);
    clearCart();
    sessionStorage.removeItem('freshmart_checkout_customer');

    showToast('Payment successful! Creating order...', 'success');

    setTimeout(() => {
        window.location.href = `../orders/index.html?orderId=${orderId}`;
    }, 1000);
}

function getMethodTitle(methodId) {
    switch (methodId) {
        case 'cod': return 'Cash on Delivery';
        case 'mobile': return 'Mobile Banking (bKash / Nagad)';
        case 'card': return 'Credit / Debit Card';
        case 'gateway': return 'Online Payment Gateway';
        default: return 'Cash on Delivery';
    }
}
