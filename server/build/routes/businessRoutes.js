"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessController_1 = require("../controllers/businessController");
//Ruta para trabajar con la tabla business de la base de datos
class BusinessRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/listAll/', businessController_1.businessController.list); //listar todos los negocios
        this.router.get('/list/:id_user', businessController_1.businessController.listid); //listar todos los negocios
        this.router.get('/one/:id', businessController_1.businessController.getOne); //mostrar un negocio por su id
        this.router.post('/', businessController_1.businessController.register); //registrar un negocio
        this.router.put('/:id', businessController_1.businessController.update); //actualizar un negocio por su id
        this.router.delete('/:id', businessController_1.businessController.delete); //eliminar un negocio por su id
        this.router.get('/verify-isExistBusiness/:name', businessController_1.businessController.isExistBusiness); //Validar el nombre del negocio
        this.router.post('/get-categoriesList', businessController_1.businessController.categoriesList); //enviar lista de categorías
    }
}
const businessRoutes = new BusinessRoutes;
exports.default = businessRoutes.router;
