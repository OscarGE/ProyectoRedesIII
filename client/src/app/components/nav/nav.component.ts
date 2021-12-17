import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from './../../services/user_service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userEmail=""
  user!: User;
  constructor(private userService :UserService) { 
  }

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion'); 
    let value = " " + sesion + " ";
    this.userEmail=JSON.parse(value)["email"];
    this.userService.getUser(JSON.parse(value)["id"])
    .subscribe({
      next: (v) =>  { 
        this.user=v
      },
      error: (e) => {console.log(e)},
      complete: () => console.info('complete')
    })
  }

  logout(){
    localStorage.removeItem('sesion');
    location.replace('/');
  }

}
