/* ==========================================================================
   FreshMart Admin Panel - Auth & Route Protection Guard
   ========================================================================== */

function checkAdminAuth() {
    const isLoginPage = window.location.pathname.includes('/admin/login/');
    const session = localStorage.getItem('freshmart_admin_session_v1');

    if (!session && !isLoginPage) {
        const isDepth3 = window.location.pathname.includes('/admin/') && !window.location.pathname.endsWith('/admin/index.html');
        const redirectPath = isDepth3 ? '../login/index.html' : './login/index.html';
        window.location.href = redirectPath;
    } else if (session && isLoginPage) {
        window.location.href = '../dashboard/index.html';
    }
}

function adminLogout() {
    localStorage.removeItem('freshmart_admin_session_v1');
    const isDepth3 = window.location.pathname.includes('/admin/') && !window.location.pathname.endsWith('/admin/index.html');
    const redirectPath = isDepth3 ? '../login/index.html' : './login/index.html';
    window.location.href = redirectPath;
}

// Run protection check
checkAdminAuth();
