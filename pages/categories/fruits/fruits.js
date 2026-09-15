/* Category Page JS - Fresh Fruits */
document.addEventListener('DOMContentLoaded', () => {
    initCategoryPage('fruits');
});

function initCategoryPage(categorySlug) {
    const allCategoryProducts = getProductsByCategory(categorySlug);
    let currentProducts = [...allCategoryProducts];

    const gridContainer = document.getElementById('category-products-grid');
    const itemCountSpan = document.getElementById('category-item-count');
    const brandFilterContainer = document.getElementById('brand-filter-group');
    const priceSlider = document.getElementById('price-range-slider');
    const priceValueDisplay = document.getElementById('price-range-val');
    const sortSelect = document.getElementById('sort-select');

    if (brandFilterContainer) {
        const brands = [...new Set(allCategoryProducts.map(p => p.brand))];
        brandFilterContainer.innerHTML = brands.map(brand => `
            <label class="filter-checkbox-label">
                <input type="checkbox" value="${brand}" class="brand-checkbox" onchange="applyFilters()" />
                <span>${brand}</span>
            </label>
        `).join('');
    }

    if (priceSlider) {
        const maxPrice = Math.max(...allCategoryProducts.map(p => p.price), 50);
        priceSlider.max = Math.ceil(maxPrice);
        priceSlider.value = Math.ceil(maxPrice);
        if (priceValueDisplay) priceValueDisplay.textContent = `৳${priceSlider.value}`;

        priceSlider.addEventListener('input', (e) => {
            if (priceValueDisplay) priceValueDisplay.textContent = `৳${e.target.value}`;
            applyFilters();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    window.applyFilters = function() {
        const selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(cb => cb.value);
        const maxP = priceSlider ? parseFloat(priceSlider.value) : Infinity;
        const inStockOnly = document.getElementById('in-stock-checkbox') ? document.getElementById('in-stock-checkbox').checked : false;
        const sortBy = sortSelect ? sortSelect.value : 'featured';

        const filters = {
            brands: selectedBrands,
            maxPrice: maxP,
            inStockOnly: inStockOnly,
            sortBy: sortBy
        };

        const filtered = filterAndSortProducts(allCategoryProducts, filters);
        renderGrid(filtered);
    };

    function renderGrid(products) {
        if (itemCountSpan) itemCountSpan.textContent = products.length;
        if (!gridContainer) return;

        if (products.length === 0) {
            gridContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:var(--bg-surface); border-radius:var(--radius-lg);">
                    <i class="fas fa-search" style="font-size:2.5rem; color:var(--text-light); margin-bottom:1rem;"></i>
                    <h3>No products match your filters</h3>
                    <p style="color:var(--text-muted); margin-top:0.5rem;">Try adjusting your price range or selected brands.</p>
                </div>
            `;
            return;
        }

        gridContainer.innerHTML = products.map(p => renderProductCard(p, '../../../')).join('');
    }

    renderGrid(currentProducts);
}
