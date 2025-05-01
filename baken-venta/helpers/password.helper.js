const bcryptjs = require('bcryptjs');

// Función para encriptar la contraseña
const encriptarPassword = (password) => {
    const salt = bcryptjs.genSaltSync();
    const passwordEncrypt = bcryptjs.hashSync(password, salt);
    return passwordEncrypt;
}

// Función para comparar la contraseña proporcionada con el hash guardado
const validarPassword = (passLogin, passDB) => {
    const passwordValida = bcryptjs.compareSync(passLogin, passDB);
    return passwordValida;
}

module.exports = {
    encriptarPassword,
    validarPassword
}
