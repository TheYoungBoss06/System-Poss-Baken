const bcryptjs = require('bcryptjs');

// FUncion para encriptar password
const encriptarPassword = (password) =>{
    const salt = bcryptjs.genSaltSync()
    const passwordEncrypt = bcryptjs.hashSync(password, salt)
    return passwordEncrypt
}


//Funcion para comparar clave con encriptada
const validarPassword = (passLogin, passDB) =>{
    passwordValida = bcryptjs.compareSync(passLogin,passDB)
    return passwordValida
}


module.exports = {
    encriptarPassword,
    validarPassword
}