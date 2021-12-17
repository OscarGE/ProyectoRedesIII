import { Router } from 'express';
import { businessController } from '../controllers/businessController';


//Ruta para trabajar con la tabla business de la base de datos
class BusinessRoutes{
  public router:Router = Router();

  constructor(){
    this.config();
  }
  config(): void{//Se definen las peticiones
    this.router.get('/listAll/', businessController.list); //listar todos los negocios
    this.router.get('/list/:id_user',businessController.listid); //listar todos los negocios
    this.router.get('/one/:id', businessController.getOne); //mostrar un negocio por su id
    this.router.post('/',businessController.register); //registrar un negocio
    this.router.put('/:id', businessController.update); //actualizar un negocio por su id
    this.router.delete('/:id', businessController.delete); //eliminar un negocio por su id
    this.router.get('/verify-isExistBusiness/:name', businessController.isExistBusiness); //Validar el nombre del negocio
    this.router.post('/get-categoriesList', businessController.categoriesList); //enviar lista de categorías
  }
}

const  businessRoutes = new  BusinessRoutes;
export default  businessRoutes.router;