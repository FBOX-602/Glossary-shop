/* Global Catalogue Product List JS */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search') || '';
    const initialFilter = urlParams.get('filter') || '';

    const allProducts = getAllProducts();
    const categories = getAllCategories();

    // Render Category checkboxes
    const catGroup = document.getElementById('category-filter-group');
    if (catGroup) {
        catGroup.innerHTML = categories.map(c => `
            <label class="filter-checkbox-label">
                <input type="checkbox" value="${c.id}" class="category-checkbox" onchange="applyGlobalFilters()" />
                <span>${c.name}</span>
            </label>
        `).join('');
    }

    // Render Brand checkboxes
    const brands = [...new Set(allProducts.map(p => p.brand))];
    const brandGroup = document.getElementById('brand-filter-group');
    if (brandGroup) {
        brandGroup.innerHTML = brands.map(b => `
            <label class="filter-checkbox-label">
                <input type="checkbox" value="${b}" class="brand-checkbox" onchange="applyGlobalFilters()" />
                <span>${b}</span>
            </label>
        `).join('');
    }

    const priceSlider = document.getElementById('price-range-slider');
    const priceValDisplay = document.getElementById('price-range-val');
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            if (priceValDisplay) priceValDisplay.textContent = `৳${e.target.value}`;
            applyGlobalFilters();
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.addEventListener('change', applyGlobalFilters);

    if (initialSearch) {
        const searchInput = document.getElementById('catalogue-search-input');
        if (searchInput) searchInput.value = initialSearch;
    }

    window.applyGlobalFilters = function() {
        const searchVal = document.getElementById('catalogue-search-input') ? document.getElementById('catalogue-search-input').value.trim() : '';
        const selectedCats = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
        const selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(cb => cb.value);
        const maxP = priceSlider ? parseFloat(priceSlider.value) : Infinity;
        const inStockOnly = document.getElementById('in-stock-checkbox') ? document.getElementById('in-stock-checkbox').checked : false;
        const sortBy = sortSelect ? sortSelect.value : 'featured';

        let filtered = allProducts;

        if (initialFilter === 'featured') {
            filtered = filtered.filter(p => p.isFeatured);
        }

        if (selectedCats.length > 0) {
            filtered = filtered.filter(p => selectedCats.includes(p.category));
        }

        const filters = {
            search: searchVal,
            brands: selectedBrands,
            maxPrice: maxP,
            inStockOnly: inStockOnly,
            sortBy: sortBy
        };

        filtered = filterAndSortProducts(filtered, filters);
        renderCatalogueGrid(filtered);
    };

    function renderCatalogueGrid(products) {
        const container = document.getElementById('catalogue-products-grid');
        const countSpan = document.getElementById('catalogue-item-count');
        if (countSpan) countSpan.textContent = products.length;
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:4rem; background:var(--bg-surface); border-radius:var(--radius-lg);">
                    <i class="fas fa-search" style="font-size:3rem; color:var(--text-light); margin-bottom:1rem;"></i>
                    <h2>No matching groceries found</h2>
                    <p style="color:var(--text-muted); margin-top:0.5rem;">Try searching for a different keyword or clearing your filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(p => renderProductCard(p, '../../../')).join('');
    }

    applyGlobalFilters();
});
