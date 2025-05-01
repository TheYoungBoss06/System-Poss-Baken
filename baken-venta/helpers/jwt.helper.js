const jwt = require('jsonwebtoken');

const { response, request } = require('express');

const generarJWT = (id_usuario, user_name) => {

    return new Promise((resolve, reject) => {

        const payload = { id_usuario, user_name };
        const claveEncriptado = process.env.SECRETJWT;

        jwt.sign(
            payload,
            claveEncriptado,
            { expiresIn: '8hrs' },
            (err, token) => {
                if (err) {
                    console.log(err)
                    reject('Error al generar JWT')
                } else {
                    resolve(token)
                }
            })
    })
}


const validarJWT = (req = request, res = response, next) => {
    const token = req.header('token');
    
    if (!token) {
        return res.status(400).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const payloadJWT = jwt.verify(token, process.env.SECRETJWT);
        req.usuarioJWT = payloadJWT
        console.log(payloadJWT)
        next();
    } catch (error) {
        res.status(401).json({
            msg: 'El token usado no es válido'
        });
    }
}


module.exports = {
    generarJWT,
    validarJWT

}
