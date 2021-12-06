"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
//Ruta para trabajar con la tabla usrs de la base de datos
class UsersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', usersController_1.usersController.list); //listar todos los usuarios
        this.router.get('/:id', usersController_1.usersController.getOne); //mostrar un usuario por su id
        this.router.post('/', usersController_1.usersController.register); //registrar un usuario
        this.router.put('/:id', usersController_1.usersController.update); //actualizar un usuario por su id
        this.router.delete('/:id', usersController_1.usersController.delete); //eliminar un usuario por su id
        this.router.post('/login', usersController_1.usersController.login); //Valida credenciales para hacer login
        this.router.get('/verify-isExistEmial/:email', usersController_1.usersController.isExistEmial); //Validar el correo de usario
    }
}
const usersRoutes = new UsersRoutes;
exports.default = usersRoutes.router;
