/* Admin Banner Management JS */
let currentEditingBannerId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderBannersList();
    window.addEventListener('dbUpdated', renderBannersList);
});

function renderBannersList() {
    const banners = getBannersDB();
    const container = document.getElementById('banners-table-body');
    if (!container) return;

    if (banners.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No banners created yet.</td></tr>';
        return;
    }

    container.innerHTML = banners.map(b => `
        <tr>
            <td>
                <img src="${b.image}" alt="${b.title}" class="banner-preview-img" />
            </td>
            <td>
                <div style="font-weight:700;">${b.title}</div>
                <div style="font-size:0.75rem; color:var(--admin-muted);">${b.tag || ''}</div>
            </td>
            <td style="font-size:0.8rem; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${b.subtitle || ''}</td>
            <td>
                <span class="badge-status ${b.status === 'active' || b.active ? 'status-delivered' : 'status-cancelled'}">
                    ${b.active !== false ? 'active' : 'disabled'}
                </span>
            </td>
            <td>
                <button onclick="toggleBannerStatus('${b.id}')" class="btn-admin btn-admin-outline btn-admin-sm">
                    ${b.active !== false ? 'Disable' : 'Enable'}
                </button>
            </td>
            <td>
                <button onclick="openEditBannerModal('${b.id}')" class="btn-admin btn-admin-outline btn-admin-sm"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteBannerItem('${b.id}')" class="btn-admin btn-admin-danger btn-admin-sm"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openAddBannerModal() {
    currentEditingBannerId = null;
    document.getElementById('banner-modal-title').textContent = 'Add New Hero Banner';
    document.getElementById('banner-tag').value = '';
    document.getElementById('banner-title').value = '';
    document.getElementById('banner-subtitle').value = '';
    document.getElementById('banner-buttonText').value = 'Shop Fresh Produce';
    document.getElementById('banner-link').value = 'pages/categories/vegetables/index.html';
    document.getElementById('banner-image').value = '';
    const fileInput = document.getElementById('banner-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('banner-modal').classList.add('active');
}

function openEditBannerModal(id) {
    const banners = getBannersDB();
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    currentEditingBannerId = id;
    document.getElementById('banner-modal-title').textContent = 'Edit Hero Banner';
    document.getElementById('banner-tag').value = banner.tag || '';
    document.getElementById('banner-title').value = banner.title || '';
    document.getElementById('banner-subtitle').value = banner.subtitle || '';
    document.getElementById('banner-buttonText').value = banner.buttonText || '';
    document.getElementById('banner-link').value = banner.link || '';
    document.getElementById('banner-image').value = banner.image || '';
    const fileInput = document.getElementById('banner-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('banner-modal').classList.add('active');
}

function closeBannerModal() {
    document.getElementById('banner-modal').classList.remove('active');
}

async function saveBannerForm(e) {
    e.preventDefault();

    let banners = getBannersDB();
    const tag = document.getElementById('banner-tag').value.trim();
    const title = document.getElementById('banner-title').value.trim();
    const subtitle = document.getElementById('banner-subtitle').value.trim();
    const buttonText = document.getElementById('banner-buttonText').value.trim();
    const link = document.getElementById('banner-link').value.trim();
    let image = document.getElementById('banner-image').value.trim();

    const fileInput = document.getElementById('banner-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (typeof uploadMediaToSupabaseBucket === 'function') {
            const uploadedUrl = await uploadMediaToSupabaseBucket('banners', file);
            if (uploadedUrl) image = uploadedUrl;
        }
    }

    if (!image) {
        image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80';
    }

    if (currentEditingBannerId) {
        const index = banners.findIndex(b => b.id === currentEditingBannerId);
        if (index > -1) {
            banners[index] = { ...banners[index], tag, title, subtitle, buttonText, link, image, active: true };
        }
    } else {
        const newBanner = {
            id: `banner-${Date.now()}`,
            tag, title, subtitle, buttonText, link, image,
            active: true,
            status: 'active',
            displayOrder: banners.length + 1
        };
        banners.push(newBanner);
    }

    saveBannersDB(banners);
    closeBannerModal();
}

function toggleBannerStatus(id) {
    let banners = getBannersDB();
    const banner = banners.find(b => b.id === id);
    if (banner) {
        banner.active = banner.active === false ? true : false;
        banner.status = banner.active ? 'active' : 'disabled';
        saveBannersDB(banners);
    }
}

async function deleteBannerItem(id) {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    let banners = getBannersDB();
    banners = banners.filter(b => b.id !== id);
    saveBannersDB(banners);

    if (typeof deleteBannerFromSupabase === 'function') {
        await deleteBannerFromSupabase(id);
    }
}
