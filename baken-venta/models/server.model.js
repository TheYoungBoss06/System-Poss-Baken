require('dotenv').config();
// const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');  
const { createServer } = require('http');

class Server {

    constructor( ) {
        this.app = express();
        this.port = process.env.PORT;
        this.httpServer = createServer(this.app);


        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors({origin: '*'}));
    }


    routes () {
        //RUTAS PADRES
        this.app.use('/login',  require('../routes/auth.routes')); //EL REQUIRE SONLOS CONTROLADORES
        this.app.use('/producto',  require('../routes/producto.routes'));

    }

    listen () {
        this.httpServer.listen ( this.port, ()=>{
            console.log(`SE ESTA EJECUTANDO CORRECTAMENTE EN EL PUERTO ${this.port}`);
        });
    }
}

module.exports = Server;