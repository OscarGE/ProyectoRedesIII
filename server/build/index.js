"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// import path from 'path';
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
class MyServer {
    constructor() {
        this.app = (0, express_1.default)(); //Se ejecuta el servidor con la función express()
        this.config(); //Se ejecuta el método de configuraciones del servidor
        this.routes(); //Se ejecuta el método de rutas (peticiones)
    }
    //Métodos
    config() {
        this.app.set('port', process.env.PORT || 3000); //Se establece el puerto dende se aloja o el 3000
        this.app.use((0, morgan_1.default)('dev')); //Muestra las peticiones por consola
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json()); //Permite leer archivos JSON
        this.app.use(express_1.default.urlencoded({ extended: false }));
        // this.app.use('/uploads', express.static(path.resolve('uploads'))); //El navegador puede acceder a uploads
    }
    routes() {
        // this.app.use('/api',indexRoutes)
        this.app.use('/api/users', usersRoutes_1.default); //ruta para trabajar con la tabla usrs de la base de datos
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
//Se crea y ejecuta el servidor
const server = new MyServer();
server.start();
