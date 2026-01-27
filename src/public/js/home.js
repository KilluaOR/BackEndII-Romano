// Cargar información del usuario al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay un token en la URL (viene de GitHub callback)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
        // Guardar el token en localStorage
        localStorage.setItem('token', tokenFromUrl);
        // Limpiar la URL removiendo el parámetro token
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    loadUserInfo();
});

async function loadUserInfo() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showError('No hay token de sesión. Por favor, inicia sesión.');
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return;
    }

    try {
        const response = await fetch('/api/sessions/current', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status === 'success' && data.user) {
            displayUserInfo(data.user);
        } else {
            showError(data.message || 'Error al cargar información del usuario');
            // Si el token es inválido, redirigir a login
            if (response.status === 401) {
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
    } catch (error) {
        showError('Error de conexión');
    }
}

function displayUserInfo(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    
    document.getElementById('userId').textContent = user._id;
    document.getElementById('userName').textContent = user.first_name;
    document.getElementById('userLastName').textContent = user.last_name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userAge').textContent = user.age;
    
    const roleBadge = document.getElementById('userRole');
    roleBadge.textContent = user.role.toUpperCase();
    roleBadge.className = `role-badge role-${user.role}`;
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').textContent = message;
}

function refreshUser() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    loadUserInfo();
}

async function logout() {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST'
        });
        
        localStorage.removeItem('token');
        window.location.href = '/login';
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}
