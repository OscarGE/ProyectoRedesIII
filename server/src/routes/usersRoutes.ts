import { Router } from 'express';
import { usersController } from '../controllers/usersController';


//Ruta para trabajar con la tabla usrs de la base de datos
class UsersRoutes{
  public router:Router = Router();

  constructor(){
    this.config();
  }
  config(): void{//Se definen las peticiones
    this.router.get('/', usersController.list); //listar todos los usuarios
    this.router.get('/:id', usersController.getOne); //mostrar un usuario por su id
    this.router.post('/',usersController.register); //registrar un usuario
    this.router.put('/:id', usersController.update); //actualizar un usuario por su id
    this.router.delete('/:id', usersController.delete); //eliminar un usuario por su id
    this.router.post('/login',usersController.login); //Valida credenciales para hacer login
    this.router.get('/verify-isExistEmial/:email', usersController.isExistEmial); //Validar el correo de usario
  }
}

const usersRoutes = new UsersRoutes;
export default usersRoutes.router;