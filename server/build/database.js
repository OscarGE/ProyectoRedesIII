"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Conexión con la base de datos
const mysql_1 = __importDefault(require("mysql"));
const keys_1 = __importDefault(require("./keys"));
const pool = mysql_1.default.createPool(keys_1.default.database); //Se define la base de datos en la constante pool
//Se realiza la conexión con la base de datos
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    connection.release();
    console.log('DB is connected');
});
exports.default = pool; //Se exporta la base de datos 
