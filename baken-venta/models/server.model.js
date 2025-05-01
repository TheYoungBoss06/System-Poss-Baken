require('dotenv').config(); // Para cargar las variables del archivo .env
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000; // Puerto por defecto 3000
        this.httpServer = createServer(this.app); // Servidor HTTP
        
        // Middleware para parsear JSON (Express ya lo incluye)
        this.app.use(express.json());

        // Configuración de middlewares y rutas
        this.middlewares();
        this.routes();
    }

    // Método para configurar middlewares
    middlewares() {
        // Servir archivos estáticos desde la carpeta 'public'
        this.app.use(express.static('public'));

        // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
        this.app.use(cors({ origin: '*' })); // Permite todas las fuentes
    }

    // Método para configurar rutas
    routes() {
        // Ruta para autenticación (login)
        this.app.use('/login', require('../routes/auth.routes')); // Asegúrate de tener este archivo

        // Ruta para productos
        this.app.use('/producto', require('../routes/producto.routes')); // Asegúrate de tener este archivo

        // Ruta para validar el JWT
        this.app.use('/validate', require('../routes/validate.routes')); // Asegúrate de tener este archivo
    }

    // Método para iniciar el servidor
    listen() {
        this.httpServer.listen(this.port, () => {
            console.log(`El servidor está corriendo en el puerto ${this.port}`);
        });
    }
}

// Exporta la clase para usarla en otras partes de la aplicación
module.exports = Server;
