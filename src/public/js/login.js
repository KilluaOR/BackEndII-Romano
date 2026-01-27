document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            // Redirigir a home
            window.location.href = '/';
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        alert('Error de conexión');
    }
});
