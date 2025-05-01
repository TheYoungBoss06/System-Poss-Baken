const { Router } = require('express')
const { loginUsuarios } = require('../controllers/login.controller');
const { validarJWT } = require('../helpers/jwt.helper');



const route = Router();


route.get('/usuario', loginUsuarios)
route.get('/cliente', loginUsuarios);




module.exports = route