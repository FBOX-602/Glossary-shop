/* Admin Product Management JS */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-table-body')) {
        initProductsListPage();
    }
    if (document.getElementById('product-edit-form')) {
        initProductFormPage();
    }
});

function initProductsListPage() {
    const categories = getCategoriesDB();
    const catFilter = document.getElementById('filter-category');
    if (catFilter) {
        catFilter.innerHTML = '<option value="">All Categories</option>' + 
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    renderProductsList();
    window.addEventListener('dbUpdated', renderProductsList);
}

function renderProductsList() {
    const products = getProductsDB();
    const container = document.getElementById('products-table-body');
    if (!container) return;

    const searchVal = document.getElementById('search-product') ? document.getElementById('search-product').value.trim().toLowerCase() : '';
    const catVal = document.getElementById('filter-category') ? document.getElementById('filter-category').value : '';

    let filtered = products;
    if (searchVal) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal) || p.brand.toLowerCase().includes(searchVal) || p.id.toLowerCase().includes(searchVal));
    }
    if (catVal) {
        filtered = filtered.filter(p => p.category === catVal);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">No products found matching filters.</td></tr>';
        return;
    }

    container.innerHTML = filtered.map(p => `
        <tr>
            <td>
                <img src="${p.image}" alt="${p.name}" class="prod-thumb-img" />
            </td>
            <td>
                <div style="font-weight:700;">${p.name}</div>
                <div style="font-size:0.75rem; color:var(--admin-muted);">SKU: ${p.id.toUpperCase()} • Brand: ${p.brand}</div>
            </td>
            <td><span class="badge-status status-confirmed">${p.categoryName || p.category}</span></td>
            <td>
                <div style="font-weight:700; color:var(--admin-primary-dark);">৳${p.price.toFixed(2)}</div>
                ${p.originalPrice ? `<div style="font-size:0.75rem; color:var(--admin-muted); text-decoration:line-through;">৳${p.originalPrice.toFixed(2)}</div>` : ''}
            </td>
            <td>
                <span class="badge-status ${p.inStock ? 'status-delivered' : 'status-cancelled'}">
                    ${p.inStock ? `${p.stock} in stock` : 'Out of stock'}
                </span>
            </td>
            <td>
                ${(p.weightVariants || []).map(v => `<span class="variant-chip-badge">${v.label}</span>`).join('')}
            </td>
            <td>
                <a href="product-form.html?id=${p.id}" class="btn-admin btn-admin-outline btn-admin-sm"><i class="fas fa-edit"></i> Edit</a>
                <button onclick="duplicateProductItem('${p.id}')" class="btn-admin btn-admin-outline btn-admin-sm" title="Duplicate"><i class="fas fa-copy"></i></button>
                <button onclick="deleteProductItem('${p.id}')" class="btn-admin btn-admin-danger btn-admin-sm" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function duplicateProductItem(id) {
    let products = getProductsDB();
    const source = products.find(p => p.id === id);
    if (!source) return;

    const dupId = `${source.category}-${Date.now().toString().slice(-4)}`;
    const duplicate = {
        ...source,
        id: dupId,
        name: `${source.name} (Copy)`
    };

    products.unshift(duplicate);
    saveProductsDB(products);
    alert(`Product duplicated successfully as ${dupId}!`);
}

async function deleteProductItem(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (typeof deleteProductDB === 'function') {
        await deleteProductDB(id);
    } else {
        let products = getProductsDB();
        products = products.filter(p => p.id !== id);
        saveProductsDB(products);
    }
}


// --- Product Form Page Controller ---
let currentVariants = [];

function initProductFormPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id');

    // Render category dropdown options
    const categories = getCategoriesDB();
    const catSelect = document.getElementById('p-category');
    if (catSelect) {
        catSelect.innerHTML = categories.map(c => `<option value="${c.id}" data-name="${c.name}">${c.name}</option>`).join('');
    }

    if (prodId) {
        const products = getProductsDB();
        const p = products.find(prod => prod.id === prodId);
        if (p) {
            document.getElementById('form-heading').textContent = `Edit Product: ${p.name}`;
            document.getElementById('p-id').value = p.id;
            document.getElementById('p-id').readOnly = true;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-brand').value = p.brand;
            document.getElementById('p-category').value = p.category;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-originalPrice').value = p.originalPrice || '';
            document.getElementById('p-stock').value = p.stock;
            document.getElementById('p-inStock').value = p.inStock ? 'true' : 'false';
            document.getElementById('p-isFeatured').checked = p.isFeatured || false;
            document.getElementById('p-image').value = p.image || '';
            document.getElementById('p-thumbnails').value = (p.thumbnails || []).join('\n');
            document.getElementById('p-shortDescription').value = p.shortDescription || '';
            document.getElementById('p-description').value = p.description || '';
            document.getElementById('p-ingredients').value = p.ingredients || '';
            document.getElementById('p-origin').value = p.origin || '';
            document.getElementById('p-storage').value = p.storage || '';
            document.getElementById('p-expiry').value = p.expiry || '';

            currentVariants = p.weightVariants ? [...p.weightVariants] : [];
        }
    } else {
        document.getElementById('form-heading').textContent = 'Add New Product';
        currentVariants = [{ label: '1 kg', priceMultiplier: 1 }];
    }

    renderVariantChipsManager();
}

function renderVariantChipsManager() {
    const container = document.getElementById('variants-manager-list');
    if (!container) return;

    container.innerHTML = currentVariants.map((v, idx) => `
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <input type="text" class="admin-form-input" value="${v.label}" onchange="updateVariantLabel(${idx}, this.value)" style="width:120px;" placeholder="Label (e.g. 1kg)" />
            <input type="number" step="0.1" class="admin-form-input" value="${v.priceMultiplier}" onchange="updateVariantMultiplier(${idx}, this.value)" style="width:100px;" placeholder="Multiplier" />
            <button type="button" onclick="removeVariant(${idx})" class="btn-admin btn-admin-danger btn-admin-sm"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function addVariantRow() {
    currentVariants.push({ label: '1 Pack', priceMultiplier: 1 });
    renderVariantChipsManager();
}

function removeVariant(idx) {
    currentVariants.splice(idx, 1);
    renderVariantChipsManager();
}

function updateVariantLabel(idx, val) {
    currentVariants[idx].label = val;
}

function updateVariantMultiplier(idx, val) {
    currentVariants[idx].priceMultiplier = parseFloat(val) || 1;
}

async function handleProductFormSubmit(e) {
    e.preventDefault();

    let products = getProductsDB();
    const categories = getCategoriesDB();

    const urlParams = new URLSearchParams(window.location.search);
    const editingId = urlParams.get('id');

    const id = editingId || document.getElementById('p-id').value.trim().toLowerCase();
    const name = document.getElementById('p-name').value.trim();
    const brand = document.getElementById('p-brand').value.trim();
    const category = document.getElementById('p-category').value;
    const catObj = categories.find(c => c.id === category);
    const categoryName = catObj ? catObj.name : category;

    const price = parseFloat(document.getElementById('p-price').value) || 0;
    const originalPriceVal = document.getElementById('p-originalPrice').value;
    const originalPrice = originalPriceVal ? parseFloat(originalPriceVal) : null;
    const stock = parseInt(document.getElementById('p-stock').value, 10) || 0;
    const inStock = document.getElementById('p-inStock').value === 'true' && stock > 0;
    const isFeatured = document.getElementById('p-isFeatured').checked;

    let image = document.getElementById('p-image').value.trim();
    const fileInput = document.getElementById('p-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (typeof uploadMediaToSupabaseBucket === 'function') {
            const uploadedUrl = await uploadMediaToSupabaseBucket('products', file);
            if (uploadedUrl) image = uploadedUrl;
        }
    }

    if (!image) {
        image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80';
    }

    const thumbnailsRaw = document.getElementById('p-thumbnails').value.trim();
    const thumbnails = thumbnailsRaw ? thumbnailsRaw.split('\n').map(t => t.trim()) : [image];

    const shortDescription = document.getElementById('p-shortDescription').value.trim();
    const description = document.getElementById('p-description').value.trim();
    const ingredients = document.getElementById('p-ingredients').value.trim();
    const origin = document.getElementById('p-origin').value.trim();
    const storage = document.getElementById('p-storage').value.trim();
    const expiry = document.getElementById('p-expiry').value.trim();

    let discount = 0;
    if (originalPrice && originalPrice > price) {
        discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const productRecord = {
        id,
        name,
        brand,
        category,
        categoryName,
        price,
        originalPrice,
        discount,
        rating: 4.8,
        reviewCount: 15,
        stock,
        inStock,
        isFeatured,
        status: 'active',
        weightVariants: currentVariants,
        image,
        thumbnails,
        shortDescription,
        description,
        ingredients,
        origin,
        storage,
        expiry
    };

    if (editingId) {
        const idx = products.findIndex(p => p.id === editingId);
        if (idx > -1) products[idx] = productRecord;
    } else {
        if (products.some(p => p.id === id)) {
            alert('A product with this SKU ID already exists!');
            return;
        }
        products.unshift(productRecord);
    }

    saveProductsDB(products);
    alert('Product saved and synchronized to Supabase successfully!');
    window.location.href = 'index.html';
}
