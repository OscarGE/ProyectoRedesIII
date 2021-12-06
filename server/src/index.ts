import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
// import path from 'path';
import usersRoutes from './routes/usersRoutes';

class MyServer{
  public app: Application; //Se define el servidor en la variable app
  constructor(){
    this.app=express(); //Se ejecuta el servidor con la función express()
    this.config(); //Se ejecuta el método de configuraciones del servidor
    this.routes(); //Se ejecuta el método de rutas (peticiones)
  }
  //Métodos
  config(): void{
    this.app.set('port', process.env.PORT || 3000); //Se establece el puerto dende se aloja o el 3000
    this.app.use(morgan('dev')); //Muestra las peticiones por consola
    this.app.use(cors()); 
    this.app.use(express.json());//Permite leer archivos JSON
    this.app.use(express.urlencoded({extended: false}));
    // this.app.use('/uploads', express.static(path.resolve('uploads'))); //El navegador puede acceder a uploads
  }
  routes(): void{
    // this.app.use('/api',indexRoutes)
    this.app.use('/api/users',usersRoutes) //ruta para trabajar con la tabla usrs de la base de datos
  }
  start(): void{ //El servidor se pone a la escucha
    this.app.listen(this.app.get('port'), ()=> {
      console.log('Server on port',this.app.get('port'));
    });
  }
}
//Se crea y ejecuta el servidor
const server = new MyServer();
server.start();


