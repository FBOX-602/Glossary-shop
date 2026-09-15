/* Admin Login JS */
function handleAdminLogin(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    const settings = typeof getSettingsDB === 'function' ? getSettingsDB() : {};
    const validPassword = settings.adminPassword || 'admin123';

    if (usernameInput === 'admin' && passwordInput === validPassword) {
        const sessionToken = {
            user: 'admin',
            token: `token_${Date.now()}`,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('freshmart_admin_session_v1', JSON.stringify(sessionToken));
        window.location.href = '../dashboard/index.html';
    } else {
        const errorAlert = document.getElementById('login-error');
        if (errorAlert) {
            errorAlert.textContent = 'Invalid Admin Username or Password! (Default: admin / admin123)';
            errorAlert.style.display = 'block';
        }
    }
}
