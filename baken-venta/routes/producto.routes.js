

const { Router } = require('express');
const { getVentas } = require('../controllers/producto.controller');

const route = Router();

route.get('/ventas', getVentas);
// route.post('/entradas', getEntradas);




module.exports = route