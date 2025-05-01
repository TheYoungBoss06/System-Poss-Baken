const bcrypt = require('bcryptjs');
const { request, response } = require('express');
const { generarJWT } = require('../helpers/jwt.helper');
const bcryptjs = require('bcryptjs');

const { listaUsuarios } = require('../db/usuarios');  // Importando listaUsuarios desde el modelo

const loginUsuarios = async (req, res) => {
    const { correo, contrasena } = req.body;
    
    // Buscar el usuario en la base de datos simulada
    const usuario = listaUsuarios.find(u => u.correo === correo);
    
    if (!usuario) {
        return res.status(400).json({
            msg: 'Correo o contraseña incorrectos'
        });
    }

    // Comparar las contraseñas
    const esValida = bcrypt.compareSync(contrasena, usuario.contrasena);
    if (!esValida) {
        return res.status(400).json({
            msg: 'Correo o contraseña incorrectos'
        });
    }

    // Si todo está bien, generar el JWT
    const token = await generarJWT(usuario.id, usuario.nombre);
    
    // Devolver respuesta con el token
    res.json({
        msg: 'Login exitoso',
        token
    });
};

module.exports = {
    loginUsuarios
};