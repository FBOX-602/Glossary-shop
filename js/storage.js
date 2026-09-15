/* ==========================================================================
   FreshMart Grocery eCommerce - Central Reactive Storage & Supabase Bridge
   ========================================================================== */

const CART_KEY = 'freshmart_cart_v1';
const WISHLIST_KEY = 'freshmart_wishlist_v1';
const ORDERS_KEY = 'freshmart_orders_v1';
const PRODUCTS_DB_KEY = 'freshmart_products_db_v1';
const CATEGORIES_DB_KEY = 'freshmart_categories_db_v1';
const BANNERS_DB_KEY = 'freshmart_banners_db_v1';
const SETTINGS_DB_KEY = 'freshmart_settings_db_v1';
const CUSTOMERS_DB_KEY = 'freshmart_customers_db_v1';
const AUTH_SESSION_KEY = 'freshmart_admin_session_v1';

// --- Local Initial Data Seeding ---
function initDatabase() {
    if (!localStorage.getItem(CATEGORIES_DB_KEY) && typeof INITIAL_CATEGORIES !== 'undefined') {
        localStorage.setItem(CATEGORIES_DB_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(PRODUCTS_DB_KEY) && typeof INITIAL_PRODUCTS !== 'undefined') {
        localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(BANNERS_DB_KEY) && typeof INITIAL_BANNERS !== 'undefined') {
        localStorage.setItem(BANNERS_DB_KEY, JSON.stringify(INITIAL_BANNERS));
    }
    if (!localStorage.getItem(SETTINGS_DB_KEY) && typeof INITIAL_SETTINGS !== 'undefined') {
        localStorage.setItem(SETTINGS_DB_KEY, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(CUSTOMERS_DB_KEY) && typeof INITIAL_CUSTOMERS !== 'undefined') {
        localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    }
}

if (typeof window !== 'undefined') {
    initDatabase();
    syncWithSupabaseAsync();
}

// --- Asynchronous Sync with Supabase Database ---
async function syncWithSupabaseAsync() {
    if (typeof fetchCategoriesFromSupabase === 'function') {
        const remoteCats = await fetchCategoriesFromSupabase();
        if (remoteCats && remoteCats.length > 0) {
            localStorage.setItem(CATEGORIES_DB_KEY, JSON.stringify(remoteCats));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'categories' } }));
        }
    }

    if (typeof fetchProductsFromSupabase === 'function') {
        const remoteProds = await fetchProductsFromSupabase();
        if (remoteProds && remoteProds.length > 0) {
            localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(remoteProds));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'products' } }));
        }
    }

    if (typeof fetchBannersFromSupabase === 'function') {
        const remoteBanners = await fetchBannersFromSupabase();
        if (remoteBanners && remoteBanners.length > 0) {
            localStorage.setItem(BANNERS_DB_KEY, JSON.stringify(remoteBanners));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'banners' } }));
        }
    }

    if (typeof fetchSettingsFromSupabase === 'function') {
        const remoteSettings = await fetchSettingsFromSupabase();
        if (remoteSettings) {
            localStorage.setItem(SETTINGS_DB_KEY, JSON.stringify(remoteSettings));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'settings' } }));
        }
    }

    if (typeof fetchOrdersFromSupabase === 'function') {
        const remoteOrders = await fetchOrdersFromSupabase();
        if (remoteOrders && remoteOrders.length > 0) {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(remoteOrders));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'orders' } }));
        }
    }

    if (typeof fetchCustomersFromSupabase === 'function') {
        const remoteCusts = await fetchCustomersFromSupabase();
        if (remoteCusts && remoteCusts.length > 0) {
            localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(remoteCusts));
            window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'customers' } }));
        }
    }
}

// --- Reactive Database Accessors ---
function getProductsDB() {
    initDatabase();
    try {
        const data = localStorage.getItem(PRODUCTS_DB_KEY);
        return data ? JSON.parse(data) : (typeof INITIAL_PRODUCTS !== 'undefined' ? INITIAL_PRODUCTS : []);
    } catch (e) {
        return typeof INITIAL_PRODUCTS !== 'undefined' ? INITIAL_PRODUCTS : [];
    }
}

function saveProductsDB(products) {
    localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'products' } }));

    // Async sync to Supabase
    if (typeof saveProductToSupabase === 'function') {
        products.forEach(p => saveProductToSupabase(p));
    }
}

function getCategoriesDB() {
    initDatabase();
    try {
        const data = localStorage.getItem(CATEGORIES_DB_KEY);
        return data ? JSON.parse(data) : (typeof INITIAL_CATEGORIES !== 'undefined' ? INITIAL_CATEGORIES : []);
    } catch (e) {
        return typeof INITIAL_CATEGORIES !== 'undefined' ? INITIAL_CATEGORIES : [];
    }
}

function saveCategoriesDB(categories) {
    localStorage.setItem(CATEGORIES_DB_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'categories' } }));

    if (typeof saveCategoryToSupabase === 'function') {
        categories.forEach(c => saveCategoryToSupabase(c));
    }
}

function getBannersDB() {
    initDatabase();
    try {
        const data = localStorage.getItem(BANNERS_DB_KEY);
        return data ? JSON.parse(data) : (typeof INITIAL_BANNERS !== 'undefined' ? INITIAL_BANNERS : []);
    } catch (e) {
        return typeof INITIAL_BANNERS !== 'undefined' ? INITIAL_BANNERS : [];
    }
}

function saveBannersDB(banners) {
    localStorage.setItem(BANNERS_DB_KEY, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'banners' } }));

    if (typeof saveBannerToSupabase === 'function') {
        banners.forEach(b => saveBannerToSupabase(b));
    }
}

function getSettingsDB() {
    initDatabase();
    try {
        const data = localStorage.getItem(SETTINGS_DB_KEY);
        return data ? JSON.parse(data) : (typeof INITIAL_SETTINGS !== 'undefined' ? INITIAL_SETTINGS : {});
    } catch (e) {
        return typeof INITIAL_SETTINGS !== 'undefined' ? INITIAL_SETTINGS : {};
    }
}

function saveSettingsDB(settings) {
    localStorage.setItem(SETTINGS_DB_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'settings' } }));

    if (typeof saveSettingsToSupabase === 'function') {
        saveSettingsToSupabase(settings);
    }
}

function getCustomersDB() {
    initDatabase();
    try {
        const data = localStorage.getItem(CUSTOMERS_DB_KEY);
        return data ? JSON.parse(data) : (typeof INITIAL_CUSTOMERS !== 'undefined' ? INITIAL_CUSTOMERS : []);
    } catch (e) {
        return typeof INITIAL_CUSTOMERS !== 'undefined' ? INITIAL_CUSTOMERS : [];
    }
}

function saveCustomersDB(customers) {
    localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(customers));

    if (typeof saveCustomerToSupabase === 'function') {
        customers.forEach(c => saveCustomerToSupabase(c));
    }
}

// --- Cart Engine ---
function getCart() {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function addToCart(productId, qty = 1, variantLabel = null) {
    const products = getProductsDB();
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) {
        return { success: false, message: 'Item unavailable or out of stock.' };
    }

    let cart = getCart();
    const targetVariant = variantLabel || (product.weightVariants && product.weightVariants[0] ? product.weightVariants[0].label : 'Standard');
    
    const variantObj = product.weightVariants ? product.weightVariants.find(v => v.label === targetVariant) : null;
    const multiplier = variantObj ? variantObj.priceMultiplier : 1;
    const itemPrice = Number((product.price * multiplier).toFixed(2));

    const existingIndex = cart.findIndex(item => item.id === productId && item.variant === targetVariant);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += Number(qty);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: itemPrice,
            originalPrice: product.originalPrice ? Number((product.originalPrice * multiplier).toFixed(2)) : null,
            image: product.image,
            variant: targetVariant,
            quantity: Number(qty)
        });
    }

    saveCart(cart);
    return { success: true, message: `Added ${product.name} (${targetVariant}) to cart!` };
}

function updateCartQty(productId, variantLabel, newQty) {
    let cart = getCart();
    const qty = parseInt(newQty, 10);
    
    if (isNaN(qty) || qty <= 0) {
        return removeFromCart(productId, variantLabel);
    }

    const item = cart.find(i => i.id === productId && i.variant === variantLabel);
    if (item) {
        item.quantity = qty;
        saveCart(cart);
    }
}

function removeFromCart(productId, variantLabel) {
    let cart = getCart();
    cart = cart.filter(i => !(i.id === productId && i.variant === variantLabel));
    saveCart(cart);
}

function clearCart() {
    saveCart([]);
}

function getCartTotals() {
    const cart = getCart();
    const settings = getSettingsDB();

    const freeThreshold = settings.freeDeliveryThreshold || 1000;
    const standardFee = settings.deliveryFee || 60;

    let subtotal = 0;
    let savings = 0;
    let itemCount = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        if (item.originalPrice) {
            savings += (item.originalPrice - item.price) * item.quantity;
        }
        itemCount += item.quantity;
    });

    const deliveryFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : standardFee;
    const total = subtotal + deliveryFee;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        savings: Number(savings.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        total: Number(total.toFixed(2)),
        itemCount
    };
}

// --- Wishlist Engine ---
function getWishlist() {
    try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveWishlist(wishlist) {
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist } }));
    } catch (e) {
        console.error('Error saving wishlist:', e);
    }
}

function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
        isAdded = true;
    }

    saveWishlist(wishlist);
    return isAdded;
}

function isInWishlist(productId) {
    return getWishlist().includes(productId);
}

// --- Orders Engine ---
function getOrders() {
    try {
        const stored = localStorage.getItem(ORDERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveOrder(orderData) {
    let orders = getOrders();
    orders.unshift(orderData);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Async sync to Supabase DB
    if (typeof saveOrderToSupabase === 'function') {
        saveOrderToSupabase(orderData);
    }

    // Also update customer history in CUSTOMERS_DB
    let customers = getCustomersDB();
    const phone = orderData.customer.phone;
    let customer = customers.find(c => c.phone === phone);

    if (customer) {
        customer.totalOrders = (customer.totalOrders || 0) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + orderData.totals.total;
        customer.lastOrderDate = orderData.date;
    } else {
        customer = {
            id: `cust-${Date.now()}`,
            name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            address: `${orderData.customer.address}, ${orderData.customer.city}`,
            totalOrders: 1,
            totalSpent: orderData.totals.total,
            lastOrderDate: orderData.date
        };
        customers.push(customer);
    }
    saveCustomersDB(customers);

    window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'orders' } }));
    return orderData;
}

function getOrderById(orderId) {
    const orders = getOrders();
    return orders.find(o => o.orderId === orderId);
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        order.orderStatus = newStatus;
        if (newStatus === 'Delivered') {
            order.paymentStatus = 'Paid';
        } else if (newStatus === 'Cancelled') {
            order.paymentStatus = 'Cancelled';
        }
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        if (typeof updateOrderStatusInSupabase === 'function') {
            updateOrderStatusInSupabase(orderId, newStatus);
        }

        window.dispatchEvent(new CustomEvent('dbUpdated', { detail: { type: 'orders' } }));
        return true;
    }
    return false;
}
