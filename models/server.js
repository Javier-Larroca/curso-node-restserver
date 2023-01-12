const express = require('express')
const cors = require ('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        this.usuarioPath = '/api/usuarios'
        this.authPath = '/api/auth'

        //Conectar a base de datos
        this.conectarDB();

        //Miiddlewares
        this.middlewear();

        //Rutas d emi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewear(){
        //CORS
        this.app.use(cors())

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuarioPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ', this.port);
        });
    }
}

module.exports = Server;