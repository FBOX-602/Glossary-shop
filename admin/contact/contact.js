/* Admin Contact Info Management JS */
document.addEventListener('DOMContentLoaded', () => {
    loadContactForm();
});

function loadContactForm() {
    const s = getSettingsDB();

    document.getElementById('c-phone').value = s.phone || '+1 (800) 555-FRESH';
    document.getElementById('c-whatsapp').value = s.whatsapp || '+1 (800) 555-9999';
    document.getElementById('c-email').value = s.email || 'support@freshmart.com';
    document.getElementById('c-address').value = s.address || '124 Fresh Harvest Avenue, Metro Green Zone';
    document.getElementById('c-businessHours').value = s.businessHours || '7:00 AM - 11:00 PM (Everyday)';
    document.getElementById('c-facebook').value = s.facebook || 'https://facebook.com';
    document.getElementById('c-instagram').value = s.instagram || 'https://instagram.com';
    document.getElementById('c-twitter').value = s.twitter || 'https://twitter.com';
}

function handleSaveContactInfo(e) {
    e.preventDefault();

    let s = getSettingsDB();
    s.phone = document.getElementById('c-phone').value.trim();
    s.whatsapp = document.getElementById('c-whatsapp').value.trim();
    s.email = document.getElementById('c-email').value.trim();
    s.address = document.getElementById('c-address').value.trim();
    s.businessHours = document.getElementById('c-businessHours').value.trim();
    s.facebook = document.getElementById('c-facebook').value.trim();
    s.instagram = document.getElementById('c-instagram').value.trim();
    s.twitter = document.getElementById('c-twitter').value.trim();

    saveSettingsDB(s);
    alert('Contact Information updated successfully! Website top-bar & footer updated live.');
}
