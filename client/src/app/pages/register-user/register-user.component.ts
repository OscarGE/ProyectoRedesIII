import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { User } from 'src/app/models/User';
import { UserService } from '../../services/user_service/user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  form!: FormGroup; //Formulario reactivo 
  newUser!: User;
  msjErr="";
  //Para determinar que la fecha límite de cumpleaños sea el día actual
  date = new Date();
  dd = String(this.date.getDate()).padStart(2, '0');
  mm = String(this.date.getMonth() + 1).padStart(2, '0');
  yyyy = this.date.getFullYear();
  today: string = this.yyyy+'-'+this.mm+'-'+this.dd;
  match: boolean = false; //Para encontrar coincidencias en las contraseñas
  existeEmail: boolean = false;
    //Para trabajar con la imagen 
  public previsualizacion!: string;
  //Para el envío de la foto
  file!: File; //campo necesario para el FromData
  //Asignación de tipo de cuenta  

  constructor(private formBuilder: FormBuilder, private userService: UserService, private sanitizer: DomSanitizer) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^\\S*$")]],
      password: ['', [Validators.required, Validators.pattern("^\\S*$")]],
      pass_conf: ['', [Validators.required]],
      name: ['', [Validators.required]],
      second_name: ['', [Validators.required]],
      third_name: ['',],
      birth: ['', [Validators.required]],
      photo: [null,]
    });
    //Evaluación reactiva
    this.form.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(value => {
      //Busca coincidencias en las contraseñas
      if(value.password !='' && value.pass_conf !=''){
        if((value.password != value.pass_conf)){
          this.match=true;
        }else{
          this.match=false;
        }
      }
      else{
        this.match=false;
      }
      //Verificar si existen coincidencias en la base de datos
      if(value.email){
        this.userService.verifyEmail(value.email)
        .subscribe({
          next: (v) =>  { 
                if(JSON.parse(JSON.stringify(v)).message =='Existe'){
                  this.existeEmail=true;
                }else if(JSON.parse(JSON.stringify(v)).message=='No existe'){
                  this.existeEmail=false;
                }
            },
          error: (e) => {},
        })
      }
    })

  }
  //Visualización de la imagen
  capturarFile(event: any) {
    const archivoCapturado = event.target.files[0];
    this.file=event.target.files[0]; //Se alamcena la imagen en el atributo file
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    })
  }
  //Convierte la imagen a base 64 para poder visualizarla 
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return;
    } catch (e) {
      return null;
    }
  }); 
  senduser(event: Event) {
    event.preventDefault();
    const value = this.form.value;
    this.newUser = {
      email: value.email,
      password: value.password,
      name: value.name,
      second_name: value.second_name,
      third_name: value.third_name,
      birth: value.birth
    };
    this.userService.loadImg(value.email, this.previsualizacion).then(urlImagen=>{
      this.newUser.urlimg=urlImagen?.toString()
      this.userService.saveUser(this.newUser)
      .subscribe({
        next: (v) => { 
          Swal.fire(
            'Cuenta creada con éxito',
            'gracias y bienvenido a HAPPY DEAL',
            'success'
          ).then((result) => {
            this.newUser = v;
            localStorage.setItem('sesion', JSON.stringify(this.newUser));
            location.replace('../happydeal/home');
          })
        },
        error: (e) => {console.error(e)},
        complete: () => console.info('complete') 
      })      
      
    })
   
  }

}
