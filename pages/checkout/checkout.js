/* Checkout Page JS */
document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary();
});

function renderCheckoutSummary() {
    const cart = getCart();
    if (!cart || cart.length === 0) {
        window.location.href = '../cart/index.html';
        return;
    }

    const itemsContainer = document.getElementById('checkout-items-summary');
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; font-size:0.875rem;">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                    <img src="${item.image}" alt="${item.name}" style="width:36px; height:36px; object-fit:contain; border-radius:4px;" />
                    <div>
                        <div style="font-weight:700;">${item.name}</div>
                        <div style="color:var(--text-muted); font-size:0.75rem;">${item.variant} x ${item.quantity}</div>
                    </div>
                </div>
                <div style="font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }

    const totals = getCartTotals();
    document.getElementById('checkout-subtotal').textContent = `৳${totals.subtotal.toFixed(2)}`;
    document.getElementById('checkout-delivery').textContent = totals.deliveryFee === 0 ? 'FREE' : `৳${totals.deliveryFee.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `৳${totals.total.toFixed(2)}`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();

    if (!firstName || !lastName || !phone || !email || !address || !city) {
        showToast('Please fill out all required fields.', 'danger');
        return;
    }

    // Save transient customer info to sessionStorage
    const customerInfo = {
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        area: document.getElementById('area').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        shippingSpeed: document.querySelector('input[name="shipping"]:checked')?.value || 'Standard'
    };

    sessionStorage.setItem('freshmart_checkout_customer', JSON.stringify(customerInfo));
    window.location.href = '../payment/index.html';
}

function selectShippingOption(elem, speed) {
    document.querySelectorAll('.shipping-option').forEach(el => el.classList.remove('active'));
    elem.classList.add('active');
    elem.querySelector('input').checked = true;
}
