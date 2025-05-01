// login.js

// Verificar si ya hay un token guardado
const token = localStorage.getItem('token');

if (token) {
  // El usuario ya ha iniciado sesión, redirigirlo al panel principal u otra página
  window.location.href = '/Fronen/index.html'; // Cambia esta ruta a la adecuada
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/login/usuario', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo: email, contrasena: password })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error en el login');
    }
    return response.json();
})
.then(data => {
    console.log('Login exitoso', data);
    localStorage.setItem('token', data.token);  // Guardar el token en el localStorage
    window.location.href = '/Fronen';  // Redirigir al dashboard
})
  .catch(error => {
      console.error('Error en el login:', error);
  });
});
