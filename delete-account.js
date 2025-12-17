document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delete-account-form');
    const statusMessage = document.getElementById('status-message');
    const modal = document.getElementById('confirm-modal');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');

    // State to store form data temporarily
    let formData = { identifier: '', password: '' };

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }

    function clearStatus() {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }

    // 1. Form Submission - Show Confirmation Modal
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearStatus();

        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value;

        if (!identifier || !password) {
            showStatus('Lütfen tüm alanları doldurun.', 'error');
            return;
        }

        formData = { identifier, password };
        modal.classList.add('active');
    });

    // 2. Cancel Deletion
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        formData = { identifier: '', password: '' };
    });

    // Close modal if clicked outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 3. Confirm Deletion - Main Logic
    confirmBtn.addEventListener('click', async () => {
        // UI Updates
        modal.classList.remove('active');
        showStatus('İşlem yapılıyor, lütfen bekleyin...', 'success');

        // Disable form elements
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(el => el.disabled = true);

        try {
            // STEP 1: Login to get Token
            const loginResponse = await fetch('https://kitapp-djq4r.ondigitalocean.app/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(loginData.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
            }

            const token = loginData.accessToken || loginData.token;

            if (!token) {
                throw new Error('Kimlik doğrulama hatası: Token alınamadı.');
            }

            // STEP 2: Wait 1 Second
            await new Promise(resolve => setTimeout(resolve, 1000));

            // STEP 3: Delete Account
            const deleteResponse = await fetch('https://kitapp-djq4r.ondigitalocean.app/api/users/me', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!deleteResponse.ok) {
                // Try to parse error message if available
                let errorMessage = 'Hesap silinirken bir hata oluştu.';
                try {
                    const errorData = await deleteResponse.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) { }
                throw new Error(errorMessage);
            }

            // STEP 4: Success
            document.getElementById('deletion-form-container').style.display = 'none';
            document.getElementById('success-container').style.display = 'block';

        } catch (error) {
            console.error('Delete error:', error);
            showStatus(error.message, 'error');
            // Re-enable form
            inputs.forEach(el => el.disabled = false);
        }
    });
});
