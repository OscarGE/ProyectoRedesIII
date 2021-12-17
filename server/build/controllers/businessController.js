"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessController = void 0;
const database_1 = __importDefault(require("../database"));
//Se definen lo que realizarán las peticiones 
class BusinessController {
    //Se ejecuta la query para listar todos los negocios
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('SELECT b.id AS id_business, b.id_user, b.name, b.description, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.id_user AS id_user, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id;', function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //Se ejecuta la query para listar todos los negocios del usairo
    listid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = req.params;
            yield database_1.default.query('SELECT b.id AS id_business, b.id_user, b.name, b.description, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.id_user AS id_user, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id WHERE b.id_user = ?', [id_user], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.length > 0) {
                    return res.json(result);
                }
                res.status(404).json({ message: 'Este usario no tiene negocios' });
            });
        });
    }
    //Se ejecuta la query para mostrar un negocio por su id
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('SELECT b.id AS id_business, b.id_user, b.name, b.description,b.latitude, b.longitude, b.address, GROUP_CONCAT(s.type) AS type, GROUP_CONCAT(s.contact) AS contact, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id INNER JOIN contacts s ON b.id = s.id_business WHERE b.id = ?', [id], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.length > 0) {
                    return res.json(result);
                }
                res.status(404).json({ message: 'Negocio no encontrado' });
            });
        });
    }
    //Se ejecuta la query para registrar un negocio
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var idP;
            if (req.body.urlimg == undefined) {
                req.body.urlimg = "";
            }
            //Se realiza la consulta de registro en la tabla business 
            yield database_1.default.query('INSERT INTO business(id_user,name,description,id_category,latitude,longitude,address,urlphoto) VALUES ("' + req.body.id_user + '","' + req.body.name + '", "' + req.body.description + '","' + req.body.id_category + '","' + req.body.latitude + '","' + req.body.longitude + '","' + req.body.address + '","' + req.body.urlimg + '");', function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    if (result.affectedRows == 1) {
                        yield database_1.default.query('SELECT id FROM business WHERE name = "' + req.body.name + '" AND id_user = "' + req.body.id_user + '" ;', function (err, result, fields) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                idP = Object.values(JSON.parse(JSON.stringify(result)));
                                //Consulta para insertar los contactos en la tabla de contacts
                                for (var i = 0; i < req.body.type.length; i++) {
                                    yield database_1.default.query('INSERT INTO contacts(id_business, type, contact) VALUES (' + idP[0].id + ',"' + req.body.type[i] + '","' + req.body.contact[i] + '");', function (err, result, fields) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (err)
                                                throw err;
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
            res.json({ message: 'Negocio registrado' });
        });
    }
    //Se ejecuta la query para actualizar un negocio por su id
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    //Se ejecuta la query para eliminar un negocio por su id
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    //Se ejecuta la query que verifica si ya existe el nombre de un negocio
    isExistBusiness(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            yield database_1.default.query('SELECT * FROM business WHERE name = ?', [name], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.length > 0) {
                    return res.json({ message: 'Existe' });
                }
                return res.json({ message: 'No existe' });
            });
        });
    }
    //Se ejecuta la query que recupera la lista de categorías
    categoriesList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('SELECT id, category FROM categories ORDER BY category ASC', function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
exports.businessController = new BusinessController();
