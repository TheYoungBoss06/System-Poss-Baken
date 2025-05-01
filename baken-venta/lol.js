const bcryptjs = require('bcryptjs');

const password = '1234';  // La contraseña en texto plano que deseas encriptar
const salt = bcryptjs.genSaltSync(10);  // Genera el salt con un "round" de 10
const hash = bcryptjs.hashSync(password, salt);  // Genera el hash a partir de la contraseña

console.log('Hash generado:', hash);  // Imprime el hash en la consola
