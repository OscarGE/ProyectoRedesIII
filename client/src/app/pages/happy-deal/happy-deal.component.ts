import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from './../../services/user_service/user.service';

@Component({
  selector: 'app-happy-deal',
  templateUrl: './happy-deal.component.html',
  styleUrls: ['./happy-deal.component.css']
})
export class HappyDealComponent implements OnInit {
  user!: User;
  constructor(private router: ActivatedRoute, private userService :UserService) {
    if (localStorage.getItem('sesion')) {
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
    } else {
      location.replace('');
    }
  }
  ngOnInit(): void {
  }
}
