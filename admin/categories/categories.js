/* Admin Category Management JS */
let currentEditingCatId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderCategoriesList();
    window.addEventListener('dbUpdated', renderCategoriesList);
});

function renderCategoriesList() {
    const categories = getCategoriesDB();
    const products = getProductsDB();
    const container = document.getElementById('categories-table-body');
    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No categories found.</td></tr>';
        return;
    }

    container.innerHTML = categories.map(c => {
        const prodCount = products.filter(p => p.category === c.id).length;
        return `
            <tr>
                <td>
                    <img src="${c.icon}" alt="${c.name}" class="cat-thumb-icon" />
                </td>
                <td>
                    <div style="font-weight:700;">${c.name}</div>
                    <div style="font-size:0.75rem; color:var(--admin-muted);">Slug: ${c.id}</div>
                </td>
                <td style="font-size:0.825rem;">${c.description || ''}</td>
                <td>
                    <span class="badge-status status-confirmed">${prodCount} Products</span>
                </td>
                <td>
                    <span class="badge-status ${c.status === 'disabled' ? 'status-cancelled' : 'status-delivered'}">
                        ${c.status || 'active'}
                    </span>
                </td>
                <td>
                    <button onclick="toggleCategoryStatus('${c.id}')" class="btn-admin btn-admin-outline btn-admin-sm">
                        ${c.status === 'disabled' ? 'Enable' : 'Disable'}
                    </button>
                    <button onclick="openEditCategoryModal('${c.id}')" class="btn-admin btn-admin-outline btn-admin-sm"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteCategoryItem('${c.id}')" class="btn-admin btn-admin-danger btn-admin-sm"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddCategoryModal() {
    currentEditingCatId = null;
    document.getElementById('cat-modal-title').textContent = 'Add New Product Category';
    document.getElementById('cat-id').value = '';
    document.getElementById('cat-id').readOnly = false;
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-description').value = '';
    document.getElementById('cat-icon').value = '';
    const fileInput = document.getElementById('cat-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('cat-modal').classList.add('active');
}

function openEditCategoryModal(id) {
    const categories = getCategoriesDB();
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    currentEditingCatId = id;
    document.getElementById('cat-modal-title').textContent = 'Edit Category';
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-id').readOnly = true;
    document.getElementById('cat-name').value = cat.name;
    document.getElementById('cat-description').value = cat.description || '';
    document.getElementById('cat-icon').value = cat.icon || '';
    const fileInput = document.getElementById('cat-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('cat-modal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('cat-modal').classList.remove('active');
}

async function saveCategoryForm(e) {
    e.preventDefault();

    let categories = getCategoriesDB();
    const id = document.getElementById('cat-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const name = document.getElementById('cat-name').value.trim();
    const description = document.getElementById('cat-description').value.trim();
    let icon = document.getElementById('cat-icon').value.trim();

    const fileInput = document.getElementById('cat-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (typeof uploadMediaToSupabaseBucket === 'function') {
            const uploadedUrl = await uploadMediaToSupabaseBucket('categories', file);
            if (uploadedUrl) icon = uploadedUrl;
        }
    }

    if (!icon) {
        icon = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&q=80';
    }

    if (currentEditingCatId) {
        const index = categories.findIndex(c => c.id === currentEditingCatId);
        if (index > -1) {
            categories[index] = { ...categories[index], name, description, icon };
        }
    } else {
        if (categories.some(c => c.id === id)) {
            alert('A category with this Slug ID already exists!');
            return;
        }
        categories.push({ id, name, description, icon, count: '0 items', status: 'active' });
    }

    saveCategoriesDB(categories);
    closeCategoryModal();
}

function toggleCategoryStatus(id) {
    let categories = getCategoriesDB();
    const cat = categories.find(c => c.id === id);
    if (cat) {
        cat.status = cat.status === 'disabled' ? 'active' : 'disabled';
        saveCategoriesDB(categories);
    }
}

async function deleteCategoryItem(id) {
    const products = getProductsDB();
    const assocCount = products.filter(p => p.category === id).length;

    if (assocCount > 0) {
        if (!confirm(`Warning: This category contains ${assocCount} product(s). Deleting it will disable those products. Proceed?`)) {
            return;
        }
    } else {
        if (!confirm('Are you sure you want to delete this category?')) return;
    }

    let categories = getCategoriesDB();
    categories = categories.filter(c => c.id !== id);
    saveCategoriesDB(categories);

    if (typeof deleteCategoryFromSupabase === 'function') {
        await deleteCategoryFromSupabase(id);
    }
}
