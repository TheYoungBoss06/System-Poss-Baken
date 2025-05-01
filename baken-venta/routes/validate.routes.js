const { Router } = require('express');
const { validarJWT } = require('../helpers/jwt.helper'); 

const route = Router();

// Ruta para validar el JWT
route.get('/', validarJWT, (req, res) => {
    res.json({ msg: 'Token válido' });
});

module.exports = route;
