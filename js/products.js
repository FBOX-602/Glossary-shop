/* ==========================================================================
   FreshMart Grocery eCommerce - Product Renderer & Filter Helper (Polished)
   ========================================================================== */

function createStarRatingHTML(rating, count) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return `
        <div class="product-rating">
            ${starsHTML}
            <span class="rating-count">(${count})</span>
        </div>
    `;
}

function renderProductCard(product, basePath = '') {
    const isWishlisted = isInWishlist(product.id);
    const defaultVariant = product.weightVariants && product.weightVariants.length > 0 ? product.weightVariants[0] : null;
    const currentPrice = defaultVariant ? (product.price * defaultVariant.priceMultiplier).toFixed(2) : product.price.toFixed(2);
    const oldPrice = product.originalPrice ? (defaultVariant ? (product.originalPrice * defaultVariant.priceMultiplier).toFixed(2) : product.originalPrice.toFixed(2)) : null;

    const detailsUrl = `৳{basePath}pages/products/product-details/index.html?id=${product.id}`;

    let variantsOptionsHTML = '';
    if (product.weightVariants && product.weightVariants.length > 0) {
        variantsOptionsHTML = `
            <select class="variant-select" data-product-id="${product.id}" onchange="handleVariantChange(event, '${product.id}')">
                ${product.weightVariants.map(v => `<option value="${v.label}" data-multiplier="${v.priceMultiplier}">${v.label}</option>`).join('')}
            </select>
        `;
    }

    return `
        <div class="product-card" id="card-৳{product.id}">
            <div class="product-badge-group">
                ${product.discount ? `<span class="badge badge-discount">-৳{product.discount}%</span>` : ''}
                ${product.isFeatured ? `<span class="badge badge-featured">Popular</span>` : ''}
            </div>

            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    title="Add to Wishlist" 
                    onclick="handleWishlistClick(event, '${product.id}')">
                <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
            </button>

            <a href="${detailsUrl}" class="product-image-box">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
            </a>

            <div class="product-info-box">
                <span class="product-brand">${product.brand}</span>
                <a href="${detailsUrl}"><h3 class="product-name" title="${product.name}">${product.name}</h3></a>
                ${createStarRatingHTML(product.rating, product.reviewCount)}

                ${variantsOptionsHTML}

                <div class="product-price-row">
                    <span class="current-price" id="price-৳{product.id}">\$${currentPrice}</span>
                    ${oldPrice ? `<span class="old-price" id="old-price-৳{product.id}">\$${oldPrice}</span>` : ''}
                </div>
            </div>

            <div class="product-card-footer">
                ${product.inStock ? `
                    <div class="qty-selector">
                        <button class="qty-btn minus" onclick="adjustCardQty('${product.id}', -1)">-</button>
                        <input type="text" class="qty-input" id="qty-৳{product.id}" value="1" readonly />
                        <button class="qty-btn plus" onclick="adjustCardQty('${product.id}', 1)">+</button>
                    </div>
                    <button class="btn btn-primary btn-block btn-sm" onclick="handleAddToCart('${product.id}')">
                        <i class="fas fa-plus"></i> Add
                    </button>
                ` : `
                    <button class="btn btn-outline btn-block btn-sm" disabled>Out of Stock</button>
                `}
            </div>
        </div>
    `;
}

function handleVariantChange(event, productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const select = event.target;
    const selectedOption = select.options[select.selectedIndex];
    const multiplier = parseFloat(selectedOption.getAttribute('data-multiplier') || 1);

    const priceElem = document.getElementById(`price-৳{productId}`);
    const oldPriceElem = document.getElementById(`old-price-৳{productId}`);

    if (priceElem) {
        priceElem.textContent = `৳${(product.price * multiplier).toFixed(2)}`;
    }
    if (oldPriceElem && product.originalPrice) {
        oldPriceElem.textContent = `৳${(product.originalPrice * multiplier).toFixed(2)}`;
    }
}

function adjustCardQty(productId, delta) {
    const qtyInput = document.getElementById(`qty-৳{productId}`);
    if (!qtyInput) return;
    let currentQty = parseInt(qtyInput.value, 10) || 1;
    currentQty = Math.max(1, currentQty + delta);
    qtyInput.value = currentQty;
}

function handleAddToCart(productId) {
    const qtyInput = document.getElementById(`qty-৳{productId}`);
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;

    const select = document.querySelector(`#card-৳{productId} .variant-select`);
    const variantLabel = select ? select.value : null;

    const result = addToCart(productId, qty, variantLabel);
    if (result.success) {
        showToast(result.message, 'success');
    } else {
        showToast(result.message, 'danger');
    }
}

function handleWishlistClick(event, productId) {
    event.stopPropagation();
    const isAdded = toggleWishlist(productId);
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');

    if (isAdded) {
        btn.classList.add('active');
        icon.className = 'fas fa-heart';
        showToast('Saved to Wishlist!', 'success');
    } else {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
        showToast('Removed from Wishlist', 'info');
    }
}

function filterAndSortProducts(products, filters) {
    let result = [...products];

    if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) ||
            p.categoryName.toLowerCase().includes(query)
        );
    }

    if (filters.maxPrice) {
        result = result.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.brands && filters.brands.length > 0) {
        result = result.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.inStockOnly) {
        result = result.filter(p => p.inStock);
    }

    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default:
                break;
        }
    }

    return result;
}
