// main.js

  // Verificar si el token está presente en el localStorage
  const token = localStorage.getItem('token');

  if (!token) {
      // Si no hay token, redirigir al login
      window.location.href = '/Fronen/pages/login.html';
  } else {
      // Validar el token con el backend
      fetch('http://localhost:3000/validate', {
          method: 'GET',
          headers: {
              'token': token // Enviar el token al backend
          }
      })
      .then(res => {
          if (!res.ok) {
              throw new Error('Token inválido');
          }
          return res.json();
      })
      .then(data => {
          console.log('Token válido:', data);
      })
      .catch(() => {
          // Si el token es inválido, redirigir al login
          localStorage.removeItem('token');
          window.location.href = '/Fronen/pages/login.html';
      });
  }

// 2. Iniciar dashboard solo si el token fue válido
function iniciarDashboard() {
  // Manejar cambios en el hash (navegación del menú)
  window.addEventListener('hashchange', manejarNavegacion);

  // Mostrar la vista actual en caso de recarga o acceso directo
  manejarNavegacion();
}

// 3. Cargar la sección correspondiente según el hash
function manejarNavegacion() {
  const hash = window.location.hash;

  if (hash === '#reportes') {
    importarReportes();
  } else if (hash === '#usuarios') {
    importarUsuarios();
  } else {
    importarInicio(); // Página de inicio por defecto
  }
}

// 4. Funciones para importar los módulos de cada sección
function importarReportes() {
  import('./reportes.js')
    .then(modulo => modulo.cargarReportes())
    .catch(err => console.error('Error al cargar reportes:', err));
}

function importarUsuarios() {
  import('./usuarios.js')
    .then(modulo => modulo.cargarUsuarios())
    .catch(err => console.error('Error al cargar usuarios:', err));
}

function importarInicio() {
  import('./inicio.js')
    .then(modulo => modulo.cargarInicio())
    .catch(err => console.error('Error al cargar inicio:', err));
}
document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/Fronen/pages/login.html'; // Redirigir al login
  });


  // prueba