//Conexión con la base de datos
import mysql from 'mysql';
import keys from "./keys";
const pool = mysql.createPool(keys.database); //Se define la base de datos en la constante pool
//Se realiza la conexión con la base de datos
pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.release();
    console.log('DB is connected');
})
export default pool; //Se exporta la base de datos 