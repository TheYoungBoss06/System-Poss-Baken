const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const router = Router();

// Ruta del archivo en la carpeta "db"
const filePath = path.join(__dirname, '../db/facturas.json');

router.post('/facturas', (req, res) => {
  const { cliente, productos, total } = req.body;

  if (!cliente || !productos || !total) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  // Crear el objeto de factura
  const nuevaFactura = {
    cliente,
    productos,
    total,
    fecha: new Date().toISOString()
  };

  try {
    // Leer el archivo existente o crear uno nuevo si no existe
    let facturas = [];
    if (fs.existsSync(filePath)) {
      const contenido = fs.readFileSync(filePath, 'utf8');
      facturas = JSON.parse(contenido);
    }

    // Agregar la nueva factura al arreglo
    facturas.push(nuevaFactura);

    // Guardar nuevamente el archivo con la factura agregada
    fs.writeFileSync(filePath, JSON.stringify(facturas, null, 2));
    console.log('Factura guardada:', nuevaFactura);

    res.status(201).json({
      mensaje: 'Factura registrada correctamente',
      factura: nuevaFactura
    });
  } catch (error) {
    console.error('Error al guardar la factura:', error);
    res.status(500).json({ error: 'Error al guardar la factura' });
  }
});

module.exports = router;
