const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const SECRETJWT = 'JWT.Secr3t-10dfad3454343545350Aqadint0vagijujutyy.td'; // Define la clave secreta


const generarJWT = (id_usuario, user_name) => {
    return new Promise((resolve, reject) => {
        const payload = { id_usuario, user_name };

        console.log('Clave secreta usada para JWT:', SECRETJWT); // Verifica que no sea undefined

        jwt.sign(
            payload,
            SECRETJWT, // Usamos la clave secreta definida anteriormente
            { expiresIn: '8h' }, // Nota: '8h', no '8hrs'
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Error al generar JWT');
                } else {
                    resolve(token);
                }
            }
        );
    });
};


const validarJWT = (req = request, res = response, next) => {
    const token = req.header('token');
    
    if (!token) {
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }
    
    try {
        const payloadJWT = jwt.verify(token, SECRETJWT); // Usamos SECRETJWT aquí
        req.usuarioJWT = payloadJWT;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'El token usado no es válido'
        });
    }
};

module.exports = {
    generarJWT,
    validarJWT
};
