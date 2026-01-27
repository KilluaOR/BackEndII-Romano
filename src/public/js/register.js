document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.redirected) {
            // Si hay redirección, seguirla (el servidor maneja el registro)
            window.location.href = response.url;
        } else {
            const data = await response.json();
            if (data.status === 'success') {
                alert('Usuario registrado correctamente');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Error al registrar usuario');
            }
        }
    } catch (error) {
        alert('Error de conexión');
    }
});
