/* Shopping Cart Page JS */
let activeDiscountPercent = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
    window.addEventListener('cartUpdated', renderCartPage);
});

function renderCartPage() {
    const cart = getCart();
    const tableContainer = document.getElementById('cart-items-list');
    const emptyContainer = document.getElementById('cart-empty-view');
    const layout = document.getElementById('cart-page-layout');

    if (!cart || cart.length === 0) {
        if (layout) layout.style.display = 'none';
        if (emptyContainer) emptyContainer.style.display = 'block';
        return;
    }

    if (layout) layout.style.display = 'grid';
    if (emptyContainer) emptyContainer.style.display = 'none';

    if (!tableContainer) return;

    tableContainer.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div style="margin-top:0.25rem;">
                    <span class="cart-item-variant">${item.variant}</span>
                    <button onclick="moveToWishlist('${item.id}', '${item.variant}')" style="font-size:0.75rem; color:var(--primary); margin-left:0.75rem; font-weight:600;">
                        <i class="far fa-heart"></i> Save for later
                    </button>
                </div>
            </div>

            <div class="qty-selector">
                <button class="qty-btn" onclick="updateCartQty('${item.id}', '${item.variant}', ${item.quantity - 1})">-</button>
                <input type="text" class="qty-input" value="${item.quantity}" readonly />
                <button class="qty-btn" onclick="updateCartQty('${item.id}', '${item.variant}', ${item.quantity + 1})">+</button>
            </div>

            <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>

            <button onclick="removeFromCart('${item.id}', '${item.variant}')" style="color:var(--danger); font-size:1.1rem;" title="Remove Item">
                <i class="fas fa-trash-can"></i>
            </button>
        </div>
    `).join('');

    calculateAndRenderTotals();
}

function calculateAndRenderTotals() {
    const totals = getCartTotals();
    let couponDiscount = 0;

    if (activeDiscountPercent > 0) {
        couponDiscount = (totals.subtotal * (activeDiscountPercent / 100));
    }

    const finalSubtotal = totals.subtotal - couponDiscount;
    const finalTotal = Math.max(0, finalSubtotal + (totals.subtotal > 0 ? totals.deliveryFee : 0));

    document.getElementById('summary-subtotal').textContent = `৳${totals.subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = totals.deliveryFee === 0 ? 'FREE' : `৳${totals.deliveryFee.toFixed(2)}`;
    
    const discountRow = document.getElementById('summary-discount-row');
    if (couponDiscount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('summary-discount-val').textContent = `-৳${couponDiscount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }

    document.getElementById('summary-grand-total').textContent = `৳${finalTotal.toFixed(2)}`;

    // Free delivery progress meter
    const freeDeliveryThreshold = 1000;
    const freeMeter = document.getElementById('free-delivery-progress');
    const freeText = document.getElementById('free-delivery-text');
    if (freeMeter && freeText) {
        if (totals.subtotal >= freeDeliveryThreshold) {
            freeMeter.style.width = '100%';
            freeText.innerHTML = '<span class="text-primary"><i class="fas fa-check-circle"></i> You unlocked FREE Delivery!</span>';
        } else {
            const needed = freeDeliveryThreshold - totals.subtotal;
            const pct = Math.min(100, (totals.subtotal / freeDeliveryThreshold) * 100);
            freeMeter.style.width = `৳{pct}%`;
            freeText.textContent = `Add ৳${needed.toFixed(2)} more for FREE Delivery!`;
        }
    }
}

function applyCouponCode() {
    const codeInput = document.getElementById('coupon-code-input');
    const code = codeInput.value.trim().toUpperCase();

    if (code === 'FRESH20') {
        activeDiscountPercent = 20;
        showToast('Coupon FRESH20 applied! 20% discount added.', 'success');
        calculateAndRenderTotals();
    } else if (code === 'SAVE10') {
        activeDiscountPercent = 10;
        showToast('Coupon SAVE10 applied! 10% discount added.', 'success');
        calculateAndRenderTotals();
    } else {
        showToast('Invalid Coupon Code. Try FRESH20', 'danger');
    }
}

function moveToWishlist(productId, variantLabel) {
    toggleWishlist(productId);
    removeFromCart(productId, variantLabel);
    showToast('Item moved to Wishlist!', 'success');
}
