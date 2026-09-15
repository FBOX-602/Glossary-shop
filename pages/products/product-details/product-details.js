/* ==========================================================================
   Product Details Page Logic
   ========================================================================== */

let currentProduct = null;
let selectedVariant = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'rice-01';

    currentProduct = getProductById(productId);

    if (!currentProduct) {
        document.getElementById('product-details-content').innerHTML = `
            <div style="text-align:center; padding:4rem;">
                <h2>Product Not Found</h2>
                <a href="../../../index.html" class="btn btn-primary" style="margin-top:1rem;">Back to Home</a>
            </div>
        `;
        return;
    }

    renderProductDetails(currentProduct);
    renderRelatedProducts(currentProduct);
});

function renderProductDetails(p) {
    // Breadcrumbs & Title
    document.getElementById('breadcrumb-category').textContent = p.categoryName;
    document.getElementById('breadcrumb-category').href = `../../categories/${p.category}/index.html`;
    document.getElementById('breadcrumb-title').textContent = p.name;
    document.title = `৳{p.name} - FreshMart`;

    // Main Image & Thumbnails
    const mainImg = document.getElementById('main-product-img');
    mainImg.src = p.image;
    mainImg.alt = p.name;

    const thumbsContainer = document.getElementById('gallery-thumbs');
    const thumbnailsList = p.thumbnails && p.thumbnails.length > 0 ? p.thumbnails : [p.image];

    thumbsContainer.innerHTML = thumbnailsList.map((thumb, idx) => `
        <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchMainImage(this, '${thumb}')">
            <img src="${thumb}" alt="${p.name}" />
        </div>
    `).join('');

    // Metadata
    document.getElementById('detail-brand').textContent = p.brand;
    document.getElementById('detail-title').textContent = p.name;
    document.getElementById('detail-rating-box').innerHTML = createStarRatingHTML(p.rating, p.reviewCount);
    document.getElementById('detail-sku').textContent = `SKU: ${p.id.toUpperCase()}`;

    // Stock Badge
    const stockBadge = document.getElementById('detail-stock-badge');
    if (p.inStock) {
        stockBadge.className = 'badge badge-stock';
        stockBadge.textContent = `In Stock (${p.stock} units available)`;
    } else {
        stockBadge.className = 'badge badge-out-of-stock';
        stockBadge.textContent = 'Out of Stock';
    }

    // Weight/Size Variants
    const variantsBox = document.getElementById('variant-chips-container');
    if (p.weightVariants && p.weightVariants.length > 0) {
        selectedVariant = p.weightVariants[0];
        variantsBox.innerHTML = p.weightVariants.map((v, idx) => `
            <button class="variant-chip ${idx === 0 ? 'active' : ''}" onclick="selectVariant(this, '${v.label}', ${v.priceMultiplier})">
                ${v.label}
            </button>
        `).join('');
    } else {
        selectedVariant = { label: 'Standard', priceMultiplier: 1 };
        variantsBox.innerHTML = `<button class="variant-chip active">Standard</button>`;
    }

    updatePriceDisplay();

    // Descriptions & Tabs
    document.getElementById('detail-short-desc').textContent = p.shortDescription || p.description;
    document.getElementById('tab-desc-content').textContent = p.description;

    // Specs Table
    document.getElementById('specs-table-body').innerHTML = `
        <tr><td>Brand</td><td>${p.brand}</td></tr>
        <tr><td>Category</td><td>${p.categoryName}</td></tr>
        <tr><td>Country of Origin</td><td>${p.origin || 'Imported'}</td></tr>
        <tr><td>Ingredients</td><td>${p.ingredients || 'Natural'}</td></tr>
        <tr><td>Storage Instructions</td><td>${p.storage || 'Store in a cool dry place'}</td></tr>
        <tr><td>Expiry Date</td><td>${p.expiry || 'See package'}</td></tr>
    `;

    // Wishlist Button state
    const wishlistBtn = document.getElementById('detail-wishlist-btn');
    if (isInWishlist(p.id)) {
        wishlistBtn.classList.add('active');
        wishlistBtn.querySelector('i').className = 'fas fa-heart';
    }
}

function switchMainImage(thumbElement, imageUrl) {
    document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
    thumbElement.classList.add('active');
    document.getElementById('main-product-img').src = imageUrl;
}

function selectVariant(chipElement, label, multiplier) {
    document.querySelectorAll('.variant-chip').forEach(el => el.classList.remove('active'));
    chipElement.classList.add('active');
    selectedVariant = { label, priceMultiplier: multiplier };
    updatePriceDisplay();
}

function updatePriceDisplay() {
    if (!currentProduct || !selectedVariant) return;
    const price = (currentProduct.price * selectedVariant.priceMultiplier).toFixed(2);
    document.getElementById('detail-current-price').textContent = `৳${price}`;

    const oldPriceElem = document.getElementById('detail-old-price');
    const discountBadge = document.getElementById('detail-discount-badge');

    if (currentProduct.originalPrice) {
        const oldPrice = (currentProduct.originalPrice * selectedVariant.priceMultiplier).toFixed(2);
        oldPriceElem.textContent = `৳${oldPrice}`;
        oldPriceElem.style.display = 'inline';
        if (discountBadge) {
            discountBadge.textContent = `-৳{currentProduct.discount}% OFF`;
            discountBadge.style.display = 'inline-flex';
        }
    } else {
        oldPriceElem.style.display = 'none';
        if (discountBadge) discountBadge.style.display = 'none';
    }
}

function adjustDetailQty(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('detail-qty-input').value = currentQuantity;
}

function executeAddToCart() {
    if (!currentProduct) return;
    const result = addToCart(currentProduct.id, currentQuantity, selectedVariant.label);
    if (result.success) {
        showToast(result.message, 'success');
    } else {
        showToast(result.message, 'danger');
    }
}

function executeBuyNow() {
    if (!currentProduct) return;
    addToCart(currentProduct.id, currentQuantity, selectedVariant.label);
    window.location.href = '../../checkout/index.html';
}

function toggleDetailWishlist() {
    if (!currentProduct) return;
    const isAdded = toggleWishlist(currentProduct.id);
    const btn = document.getElementById('detail-wishlist-btn');
    const icon = btn.querySelector('i');

    if (isAdded) {
        btn.classList.add('active');
        icon.className = 'fas fa-heart';
        showToast('Added to Wishlist', 'success');
    } else {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
        showToast('Removed from Wishlist', 'info');
    }
}

function switchTab(btn, tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function renderRelatedProducts(product) {
    const related = getProductsByCategory(product.category)
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    const container = document.getElementById('related-products-grid');
    if (!container) return;

    if (related.length === 0) {
        document.getElementById('related-section').style.display = 'none';
        return;
    }

    container.innerHTML = related.map(p => renderProductCard(p, '../../../')).join('');
}
