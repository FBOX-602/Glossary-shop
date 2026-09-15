/* ==========================================================================
   FreshMart Grocery eCommerce - Global App Initialization & Main JS (Polished)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    syncLiveContactSettings();
    renderDynamicBanners();
    initHeaderSearch();
    updateBadges();
    initHeroSlider();
    initCustomListeners();
    highlightActiveNavLink();
});

// Sync store contact info, site name, and social links from localStorage settings
function syncLiveContactSettings() {
    if (typeof getSettingsDB !== 'function') return;
    const settings = getSettingsDB();

    // 1. Top Bar Phone & Email
    const topBarInfoElements = document.querySelectorAll('.top-bar-info span');
    topBarInfoElements.forEach(el => {
        if (el.innerHTML.includes('fa-headset') && settings.phone) {
            el.innerHTML = `<i class="fas fa-headset"></i> Support: ${settings.phone}`;
        }
        if (el.innerHTML.includes('fa-envelope') && settings.email) {
            el.innerHTML = `<i class="fas fa-envelope"></i> ${settings.email}`;
        }
    });

    // 2. Footer Contact List
    const footerContactList = document.querySelector('.contact-info-list');
    if (footerContactList) {
        footerContactList.innerHTML = `
            ${settings.address ? `<li><i class="fas fa-location-dot"></i> ${settings.address}</li>` : ''}
            ${settings.phone ? `<li><i class="fas fa-phone"></i> Hotline: ${settings.phone}</li>` : ''}
            ${settings.whatsapp ? `<li><i class="fab fa-whatsapp"></i> WhatsApp: ${settings.whatsapp}</li>` : ''}
            ${settings.businessHours ? `<li><i class="fas fa-clock"></i> Hours: ${settings.businessHours}</li>` : ''}
        `;
    }

    // 3. Social Media Links in Footer
    const footerSocials = document.querySelector('.footer-socials');
    if (footerSocials) {
        footerSocials.innerHTML = `
            ${settings.facebook ? `<a href="${settings.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
            ${settings.instagram ? `<a href="${settings.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
            ${settings.twitter ? `<a href="${settings.twitter}" target="_blank" title="Twitter"><i class="fab fa-x-twitter"></i></a>` : ''}
        `;
    }
}

// Render homepage Hero Banners dynamically from Banners DB
function renderDynamicBanners() {
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (!sliderContainer || typeof getActiveBanners !== 'function') return;

    const banners = getActiveBanners();
    if (!banners || banners.length === 0) return;

    const slidesHtml = banners.map((b, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.25) 100%), url('${b.image}');">
            <div class="container">
                <div class="slide-content">
                    ${b.tag ? `<span class="slide-tag">${b.tag}</span>` : ''}
                    <h1 class="slide-title">${b.title}</h1>
                    <p class="slide-subtitle">${b.subtitle || ''}</p>
                    <a href="${b.link || '#'}" class="btn btn-primary btn-lg">
                        ${b.buttonText || 'Shop Now'} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    const dotsHtml = banners.map((_, idx) => `
        <div class="dot ${idx === 0 ? 'active' : ''}"></div>
    `).join('');

    sliderContainer.innerHTML = `
        ${slidesHtml}
        <button class="slider-arrow prev" title="Previous Slide"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-arrow next" title="Next Slide"><i class="fas fa-chevron-right"></i></button>
        <div class="slider-dots">
            ${dotsHtml}
        </div>
    `;
}

// Automatically highlight matching active link in Category Nav Bar based on URL path
function highlightActiveNavLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.cat-nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;

        const hrefClean = href.replace(/\.\.\//g, '').replace('./', '').toLowerCase();

        if (currentPath.includes('/pages/products/product-list') && hrefClean.includes('product-list')) {
            link.classList.add('active');
        } else if (currentPath.includes('/pages/categories/')) {
            const parts = currentPath.split('/');
            const catIdx = parts.indexOf('categories');
            if (catIdx > -1 && parts[catIdx + 1]) {
                const catSlug = parts[catIdx + 1];
                if (hrefClean.includes(`categories/${catSlug}/`)) {
                    link.classList.add('active');
                }
            }
        } else if (!currentPath.includes('/pages/') && (hrefClean === 'index.html' || hrefClean === '')) {
            link.classList.add('active');
        }
    });
}

// Update Cart and Wishlist badges in Navbar
function updateBadges() {
    const totals = getCartTotals();
    const cartBadges = document.querySelectorAll('.cart-count-badge');
    cartBadges.forEach(badge => {
        badge.textContent = totals.itemCount;
        badge.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
    });

    const wishlist = getWishlist();
    const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
    wishlistBadges.forEach(badge => {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'inline-flex' : 'none';
    });
}

function initCustomListeners() {
    window.addEventListener('cartUpdated', updateBadges);
    window.addEventListener('wishlistUpdated', updateBadges);
    window.addEventListener('dbUpdated', () => {
        syncLiveContactSettings();
        renderDynamicBanners();
        initHeroSlider();
    });
}

// Live Header Search & Auto-complete
function initHeaderSearch() {
    const searchInputs = document.querySelectorAll('.search-input');

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            const suggestionsBox = input.parentElement.parentElement.querySelector('.search-suggestions');
            if (!suggestionsBox) return;

            if (query.length < 2) {
                suggestionsBox.classList.remove('active');
                return;
            }

            const allProducts = getAllProducts();
            const matches = allProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.brand.toLowerCase().includes(query) ||
                p.categoryName.toLowerCase().includes(query)
            ).slice(0, 5);

            if (matches.length === 0) {
                suggestionsBox.innerHTML = '<div class="suggestion-item"><span style="color:var(--text-muted); font-size:0.875rem;">No matching groceries found</span></div>';
            } else {
                const pathPrefix = window.location.pathname.includes('/pages/') ? '../../../' : './';
                
                suggestionsBox.innerHTML = matches.map(p => `
                    <div class="suggestion-item" onclick="window.location.href='${pathPrefix}pages/products/product-details/index.html?id=${p.id}'">
                        <img src="${p.image}" alt="${p.name}" class="suggestion-thumb" />
                        <div>
                            <div style="font-weight:700; font-size:0.85rem; color:var(--text-main);">${p.name}</div>
                            <div style="font-size:0.75rem; color:var(--primary); font-weight:600;">৳${p.price.toFixed(2)} • ${p.categoryName}</div>
                        </div>
                    </div>
                `).join('');
            }
            suggestionsBox.classList.add('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search')) {
            document.querySelectorAll('.search-suggestions').forEach(box => box.classList.remove('active'));
        }
    });
}

// Toast Notifications Engine
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-check-circle';
    if (type === 'danger') iconClass = 'fa-exclamation-circle';
    if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

// Hero Carousel Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    if (prevBtn) {
        prevBtn.onclick = null;
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.onclick = null;
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            startAutoplay();
        });
    }

    dots.forEach((dot, idx) => {
        dot.onclick = null;
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startAutoplay();
        });
    });

    startAutoplay();
}
