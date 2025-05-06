const fs = require('fs');
const { Router } = require('express');
const router = Router();

router.post('/factura', (req, res) => {
  const { cliente, productos, total } = req.body;

  if (!cliente || !productos || !total) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  // Crear el objeto de factura
  const factura = {
    cliente,
    productos,
    total
  };

  // Ruta donde se guardará el archivo JSON
  const filePath = '../db/factura.json';  // Puedes cambiar la ruta a donde desees

  // Guardar la factura en el archivo JSON (sobrescribirá el archivo si ya existe)
  try {
    fs.writeFileSync(filePath, JSON.stringify(factura, null, 2)); // El segundo parámetro 2 es para dar formato al JSON
    console.log('Factura guardada:', factura);
  } catch (error) {
    console.error('Error al guardar la factura:', error);
    return res.status(500).json({ error: 'Error al guardar la factura' });
  }

  // Responder con un mensaje de éxito
  res.status(201).json({
    mensaje: 'Factura creada y guardada correctamente',
    factura
  });
});

module.exports = router;
