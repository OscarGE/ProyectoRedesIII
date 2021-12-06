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
exports.usersController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../database"));
//Se definen lo que realizarán las peticiones 
class UserController {
    //Se ejecuta la query para listar todos los usuarios
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('SELECT * FROM users', function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //Se ejecuta la query para mostrar un usuario por su id
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('SELECT * FROM users WHERE id = ?', [id], function (err, result, fields) {
                console.log('SELECT * FROM users WHERE id = ?', [id]);
                if (err)
                    throw err;
                if (result.length > 0) {
                    return res.json(result[0]);
                }
                res.status(404).json({ message: 'Usuario no encontrado' });
            });
        });
    }
    //Se ejecuta la query para registrar un usuario
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.password = yield bcryptjs_1.default.hash(req.body.password, 8); //Encriptando la contraseña
            yield database_1.default.query('INSERT INTO users set ?', [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res.json({ message: 'Usario registrado', id: result.insertId });
            });
        });
    }
    //Se ejecuta la query para actualizar un usuario por su id
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //Se obtiene primero la ruta de la foto actual para eliminarla
            yield database_1.default.query('SELECT * FROM users WHERE id = ?', [id], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    if (result[0]) { //Si existe el usairo
                        req.body.password = yield bcryptjs_1.default.hash(req.body.password, 8); //Encriptando la contraseña
                        //Se ejecuta la query para actualizar al usario
                        yield database_1.default.query('UPDATE users set ? WHERE id = ?', [req.body, id], function (err, result, fields) {
                            if (err)
                                throw err;
                            if (result.affectedRows == 1) {
                                res.json({ message: 'El usuario fue actualizado' });
                            }
                            else {
                                res.status(404).json({ message: 'Usuario no actualizado' });
                            }
                        });
                    }
                    else {
                        res.status(404).json({ message: 'Usuario no encontrado' });
                    }
                });
            });
        });
    }
    //Se ejecuta la query para eliminar un usuario por su id
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //Consulta para eleiminar al usuairo 
            yield database_1.default.query('DELETE FROM users WHERE id = ?', [id], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.affectedRows == 1) {
                    res.json({ message: 'El usuario fue eliminado' });
                }
                else {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                }
            });
        });
    }
    //Se ejecuta la query para validar credenciales y permitir login
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('SELECT * FROM users WHERE email = ? ', [req.body.email], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.length == 1) {
                    if (bcryptjs_1.default.compareSync(req.body.password, result[0].password)) {
                        return res.json(result[0]);
                    }
                    else {
                        res.status(404).json({ message: 'La contraseña no coincide' });
                    }
                }
                else {
                    res.status(404).json({ message: 'E-mail no registrado' });
                }
            });
        });
    }
    //Se ejecuta la query que verifica si ya existe el email
    isExistEmial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            yield database_1.default.query('SELECT * FROM users WHERE email = ?', [email], function (err, result, fields) {
                if (err)
                    throw err;
                if (result.length > 0) {
                    return res.json({ message: 'Existe' });
                }
                return res.json({ message: 'No existe' });
            });
        });
    }
}
exports.usersController = new UserController();
