import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserService } from '../../services/user_service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup; //Formulario reactivo 
  login!: User;
  msjErr="";

  constructor(private router: ActivatedRoute, private formBuilder: FormBuilder, private userService: UserService) {
    //Validar la localStorage por si ya hay una sesión iniciada
    if (localStorage.getItem('sesion')) {
      location.replace('/happydeal/home');
    } else {
      console.log('no hay sesion activa');
    }
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^\\S*$")]],
      password: ['', [Validators.required, Validators.pattern("^\\S*$")]],
    });
    //Evaluación reactiva

  }

  sendlogin(event: Event) {
    event.preventDefault();
    const value = this.form.value;
    this.login = {
      email: value.email,
      password: value.password,
    };

    this.userService.login(this.login)
      .subscribe({
        next: (v) => { 
            this.login = v;
            localStorage.setItem('sesion', JSON.stringify(this.login));
            location.replace('/happydeal/home');},
        error: (e) => {
            this.msjErr="El email o la contraseña ingresados son erróneos. Por favor, inténtelo de nuevo.";
            console.error(e)},
        complete: () => console.info('complete') 
      })
  }
}
