/* Admin Website Settings JS */
document.addEventListener('DOMContentLoaded', () => {
    loadSettingsForm();
    loadSupabaseForm();
    testSupabaseConnectionStatus();
});

function loadSettingsForm() {
    const s = getSettingsDB();

    document.getElementById('st-siteName').value = s.siteName || 'FreshMart';
    document.getElementById('st-currency').value = s.currency || '৳';
    document.getElementById('st-freeDelivery').value = s.freeDeliveryThreshold || 1000;
    document.getElementById('st-deliveryFee').value = s.deliveryFee || 60;
}

function loadSupabaseForm() {
    const urlInput = document.getElementById('st-supabaseUrl');
    const keyInput = document.getElementById('st-supabaseAnonKey');

    if (urlInput) urlInput.value = 'https://hlrmvpbpqcjcmgithaff.supabase.co';
    if (keyInput) {
        const savedKey = localStorage.getItem('freshmart_supabase_anon_key') || '';
        keyInput.value = savedKey;
    }
}

async function testSupabaseConnectionStatus() {
    const statusBox = document.getElementById('supabase-status-badge');
    if (!statusBox) return;

    statusBox.innerHTML = '<span class="badge-status status-pending"><i class="fas fa-spinner fa-spin"></i> Checking Supabase Connection...</span>';

    const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (!client) {
        statusBox.innerHTML = '<span class="badge-status status-cancelled"><i class="fas fa-plug-circle-xmark"></i> Supabase Client Not Initialized</span>';
        return;
    }

    try {
        const { data, error } = await client.from('categories').select('id').limit(1);

        if (error) {
            statusBox.innerHTML = `
                <div style="background:#fef2f2; border:1px solid #fca5a5; padding:0.75rem 1rem; border-radius:8px; color:#991b1b; font-size:0.85rem;">
                    <strong><i class="fas fa-circle-exclamation"></i> Supabase Not Connected Yet!</strong><br/>
                    Reason: ${error.message}<br/>
                    <small>Please enter your <strong>Supabase Anon API Key</strong> below and run <code>supabase-schema.sql</code> in your Supabase SQL Editor.</small>
                </div>
            `;
        } else {
            statusBox.innerHTML = `
                <div style="background:#ecfdf5; border:1px solid #6ee7b7; padding:0.75rem 1rem; border-radius:8px; color:#065f46; font-size:0.85rem;">
                    <strong><i class="fas fa-circle-check"></i> Supabase Connected & Synchronized Live!</strong><br/>
                    Project ID: <code>hlrmvpbpqcjcmgithaff</code> • Real-time database replication active.
                </div>
            `;
        }
    } catch (err) {
        statusBox.innerHTML = `
            <div style="background:#fef2f2; border:1px solid #fca5a5; padding:0.75rem 1rem; border-radius:8px; color:#991b1b; font-size:0.85rem;">
                <strong><i class="fas fa-circle-xmark"></i> Connection Error:</strong> ${err.message}
            </div>
        `;
    }
}

async function handleSaveSupabaseConfig(e) {
    e.preventDefault();

    const anonKey = document.getElementById('st-supabaseAnonKey').value.trim();

    if (!anonKey) {
        alert('Please paste your Supabase Anon / Publishable API Key!');
        return;
    }

    localStorage.setItem('freshmart_supabase_anon_key', anonKey);
    if (typeof SUPABASE_CONFIG !== 'undefined') {
        SUPABASE_CONFIG.anonKey = anonKey;
    }

    // Re-initialize client
    if (typeof supabaseClient !== 'undefined') {
        supabaseClient = null;
    }

    alert('Supabase Anon API Key saved! Testing live connection...');
    await testSupabaseConnectionStatus();
}

function handleSaveGeneralSettings(e) {
    e.preventDefault();

    let s = getSettingsDB();
    s.siteName = document.getElementById('st-siteName').value.trim();
    s.currency = document.getElementById('st-currency').value.trim();
    s.freeDeliveryThreshold = parseFloat(document.getElementById('st-freeDelivery').value) || 1000;
    s.deliveryFee = parseFloat(document.getElementById('st-deliveryFee').value) || 60;

    saveSettingsDB(s);
    alert('Website general settings updated successfully!');
}

function handleChangePassword(e) {
    e.preventDefault();

    const currentPass = document.getElementById('st-currentPass').value.trim();
    const newPass = document.getElementById('st-newPass').value.trim();
    const confirmPass = document.getElementById('st-confirmPass').value.trim();

    let s = getSettingsDB();
    const activePass = s.adminPassword || 'admin123';

    if (currentPass !== activePass) {
        alert('Current password is incorrect!');
        return;
    }

    if (!newPass || newPass.length < 4) {
        alert('New password must be at least 4 characters long!');
        return;
    }

    if (newPass !== confirmPass) {
        alert('New password and confirm password do not match!');
        return;
    }

    s.adminPassword = newPass;
    saveSettingsDB(s);

    alert('Admin password updated successfully! Next login will require your new password.');
    document.getElementById('password-form').reset();
}
