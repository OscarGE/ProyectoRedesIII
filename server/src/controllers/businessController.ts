import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../database';

//Se definen lo que realizarán las peticiones 
class BusinessController {
  //Se ejecuta la query para listar todos los negocios
  public async list(req: Request, res: Response): Promise<void> {
    await pool.query('SELECT b.id AS id_business, b.id_user, b.name, b.description, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.id_user AS id_user, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id;', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  }
  //Se ejecuta la query para listar todos los negocios del usairo
  public async listid(req: Request, res: Response): Promise<void> {
    const { id_user } = req.params;
    await pool.query('SELECT b.id AS id_business, b.id_user, b.name, b.description, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.id_user AS id_user, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id WHERE b.id_user = ?', [id_user], function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        return res.json(result);
      }
      res.status(404).json({ message: 'Este usario no tiene negocios' });
    });
  }
  //Se ejecuta la query para mostrar un negocio por su id
  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    await pool.query('SELECT b.id AS id_business, b.id_user, b.name, b.description,b.latitude, b.longitude, b.address, GROUP_CONCAT(s.type) AS type, GROUP_CONCAT(s.contact) AS contact, b.urlphoto AS img_business, b.registered_at, b.id_category, c.category, i.name AS name_user, i.second_name, i.third_name, i.urlimg AS img_user, u.email FROM business b INNER JOIN categories c ON b.id_category = c.id INNER JOIN users_info i ON b.id_user = i.id_user INNER JOIN users u ON b.id_user = u.id INNER JOIN contacts s ON b.id = s.id_business WHERE b.id = ?', [id], function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        return res.json(result);
      }
      res.status(404).json({ message: 'Negocio no encontrado' });
    })
  }
  //Se ejecuta la query para registrar un negocio
  public async register(req: Request, res: Response): Promise<void> {
    var idP:any
     if(req.body.urlimg==undefined){
      req.body.urlimg=""
    }
    //Se realiza la consulta de registro en la tabla business 
    await pool.query('INSERT INTO business(id_user,name,description,id_category,latitude,longitude,address,urlphoto) VALUES ("'+req.body.id_user+'","'+req.body.name+'", "'+req.body.description+'","'+req.body.id_category+'","'+req.body.latitude+'","'+req.body.longitude+'","'+req.body.address+'","'+req.body.urlimg+'");',async function(err, result, fields){
      if (err) throw err;
      if(result.affectedRows==1){
         await pool.query('SELECT id FROM business WHERE name = "'+req.body.name+'" AND id_user = "'+req.body.id_user+'" ;',async function(err, result, fields){
            if (err) throw err;
            idP=Object.values(JSON.parse(JSON.stringify(result)))
            //Consulta para insertar los contactos en la tabla de contacts
            for(var i=0; i<req.body.type.length; i++){
              await pool.query('INSERT INTO contacts(id_business, type, contact) VALUES ('+idP[0].id+',"'+req.body.type[i]+'","'+req.body.contact[i]+'");',async function(err, result, fields){
                  if (err) throw err;
              });
            }
         });
      }
    }); 
    res.json({message: 'Negocio registrado'});
  }
  //Se ejecuta la query para actualizar un negocio por su id
  public async update(req: Request, res: Response): Promise<any> {
    
  }
  //Se ejecuta la query para eliminar un negocio por su id
  public async delete(req: Request, res: Response): Promise<any> {
    
  }
  //Se ejecuta la query que verifica si ya existe el nombre de un negocio
  public async isExistBusiness(req: Request, res: Response): Promise<any>{
    const { name } = req.params;
      await pool.query('SELECT * FROM business WHERE name = ?', [name],function(err, result, fields) {
        if (err) throw err;
        if(result.length>0){
          return res.json({message: 'Existe'});
        }
        return res.json({message: 'No existe'});
      });
  }
  //Se ejecuta la query que recupera la lista de categorías
  public async categoriesList(req: Request, res: Response): Promise<any>{
    await pool.query('SELECT id, category FROM categories ORDER BY category ASC', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  }
}
export const businessController = new BusinessController();