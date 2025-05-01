const { Router } = require('express');
const { loginUsuarios } = require('../controllers/login.controller');
const { validarJWT } = require('../helpers/jwt.helper');

const route = Router();


// Ruta para login de usuario (POST) - Iniciar sesión
route.post('/usuario', loginUsuarios);

// Ruta para login de cliente (POST) - Iniciar sesión
route.post('/cliente', loginUsuarios);

// Ruta para validar el JWT
route.get('/validate', validarJWT, (req, res) => {
    res.json({ msg: 'Token válido' });
});
// Ruta de prueba para verificar que la API está funcionando

  
module.exports = route;
