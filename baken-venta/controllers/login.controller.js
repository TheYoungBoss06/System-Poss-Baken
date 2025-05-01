

const {request, response} = require('express');
const { generarJWT } = require('../helpers/jwt.helper');


// listaUsuario = [{nombre: 'Elvin', id: 10, apellido: 'Gonzalez'}]

const loginUsuarios = async (req = request, res = response) =>{

    // const {usuarioLocal, contrasena} = req.body;

    try {
    // const existe = listaUsuario.existe(usuario => usuario.nombre == usuarioLocal && usuario.contrasena == contrasena);
    // const dataUsuario = listaUsuario.find(usuario => usuario.nombre == usuarioLocal && usuario.contrasena == contrasena);

    // if(existe){
    //     const token = await generarJWT(dataUsuario.idUsuario, dataUsuario.usuarioLocal); 
    //     console.log(token )
    //     return res.status(200).json({token, existe, dataUsuario});
    // }
    return res.status(200).json('HOLA MUNDO');
    } catch (error) {
        res.status(500).json('error');
  }
}

module.exports  = { loginUsuarios}//