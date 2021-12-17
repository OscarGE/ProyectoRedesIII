import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from './../../services/user_service/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user!: User;
  constructor(private userService :UserService) { 
  }

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion'); 
    let value = " " + sesion + " ";
    this.userService.getUser(JSON.parse(value)["id"])
    .subscribe({
      next: (v) =>  { 
        this.user=v
      },
      error: (e) => {console.log(e)},
      complete: () => console.info('complete')
    })
  }
}
