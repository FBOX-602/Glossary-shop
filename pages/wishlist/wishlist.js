/* Wishlist Page JS */
document.addEventListener('DOMContentLoaded', () => {
    renderWishlistPage();
    window.addEventListener('wishlistUpdated', renderWishlistPage);
});

function renderWishlistPage() {
    const savedIds = getWishlist();
    const container = document.getElementById('wishlist-products-grid');
    const emptyView = document.getElementById('wishlist-empty-view');

    if (!savedIds || savedIds.length === 0) {
        if (container) container.style.display = 'none';
        if (emptyView) emptyView.style.display = 'block';
        return;
    }

    if (container) container.style.display = 'grid';
    if (emptyView) emptyView.style.display = 'none';

    const savedProducts = savedIds.map(id => getProductById(id)).filter(p => p !== undefined);

    if (container) {
        container.innerHTML = savedProducts.map(p => renderProductCard(p, '../../')).join('');
    }
}
