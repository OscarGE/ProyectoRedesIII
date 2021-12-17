import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../database';

//Se definen lo que realizarán las peticiones 
class UserController {
  //Se ejecuta la query para listar todos los usuarios
  public async list(req: Request, res: Response): Promise<void> {
    await pool.query('SELECT * FROM users', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  }
  //Se ejecuta la query para mostrar un usuario por su id
  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    await pool.query('SELECT * FROM users INNER JOIN users_info on id = id_user WHERE id = ?', [id], function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        return res.json(result[0]);
      }
      res.status(404).json({ message: 'Usuario no encontrado' });
    });
  }
  //Se ejecuta la query para registrar un usuario
  public async register(req: Request, res: Response): Promise<void> {
    req.body.password	= await bcryptjs.hash(req.body.password	, 8); //Encriptando la contraseña
    if(req.body.urlimg==undefined){
      req.body.urlimg=""
    }
    await pool.query('INSERT INTO users (email,password) VALUES ("'+req.body.email+'","'+req.body.password+'");',async function(err, result, fields) {
      if (err) throw err;
      await pool.query('INSERT INTO users_info (id_user,name,second_name,third_name,birth,urlimg) VALUES ("'+result.insertId+'","'+req.body.name+'","'+req.body.second_name+'","'+req.body.third_name+'","'+req.body.birth+'","'+req.body.urlimg+'");',async function(err, result, fields) {
        if (err) throw err;
        await pool.query('SELECT * FROM users WHERE email = ? ', [req.body.email],async function (err, result, fields) {
        return res.json(result[0]);
        });
      });
      
    });
    
  }
  //Se ejecuta la query para actualizar un usuario por su id
  public async update(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    //Se obtiene primero la ruta de la foto actual para eliminarla
    await pool.query('SELECT * FROM users WHERE id = ?', [id],async function(err, result, fields) {
      if (err) throw err;
      if(result[0]){ //Si existe el usairo
        req.body.password= await bcryptjs.hash(req.body.password, 8); //Encriptando la contraseña
        //Se ejecuta la query para actualizar al usario
        await pool.query('UPDATE users set ? WHERE id = ?', [req.body, id],function(err, result, fields) {
          if (err) throw err;
          if(result.affectedRows==1){
            res.json({message: 'El usuario fue actualizado'});
          }else{
            res.status(404).json({message: 'Usuario no actualizado'});
          }
        });
      }else{
        res.status(404).json({message: 'Usuario no encontrado'});
      }
    }); 
  }
  //Se ejecuta la query para eliminar un usuario por su id
  public async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    //Consulta para eleiminar al usuairo 
    await pool.query('DELETE FROM users WHERE id = ?', [id],function(err, result, fields) {
      if (err) throw err;
      if(result.affectedRows==1){
        res.json({message: 'El usuario fue eliminado'});
      }
      else{
        res.status(404).json({message: 'Usuario no encontrado'}); 
      }
    });
  }
  //Se ejecuta la query para validar credenciales y permitir login
  public async login(req: Request, res: Response): Promise<any> {
    await pool.query('SELECT * FROM users WHERE email = ? ', [req.body.email], function (err, result, fields) {
      if (err) throw err;
      if (result.length == 1) {
        if(bcryptjs.compareSync(req.body.password, result[0].password) ){
            return res.json(result[0]);
        }else {
          res.status(404).json({message: 'La contraseña no coincide'});
        }
      }
      else{
        res.status(404).json({message: 'E-mail no registrado'}); 
      }
    });
  }
  //Se ejecuta la query que verifica si ya existe el email
  public async isExistEmial(req: Request, res: Response): Promise<any>{
    const { email } = req.params;
      await pool.query('SELECT * FROM users WHERE email = ?', [email],function(err, result, fields) {
        if (err) throw err;
        if(result.length>0){
          return res.json({message: 'Existe'});
        }
        return res.json({message: 'No existe'});
      });
  }
}
export const usersController = new UserController();