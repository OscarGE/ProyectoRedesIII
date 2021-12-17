import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Business } from 'src/app/models/Business';
import { UserService } from './../../services/user_service/user.service';
import { BusinessService } from './../../services/business_service/business.service';

@Component({
  selector: 'app-view-my-business',
  templateUrl: './view-my-business.component.html',
  styleUrls: ['./view-my-business.component.css']
})
export class ViewMyBusinessComponent implements OnInit {
  businessList:any;
  constructor(private userService :UserService, private businessService :BusinessService) { }

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion'); 
    let value = " " + sesion + " ";
    this.businessService.getMyBusiness(JSON.parse(value)["id"])
    .subscribe({
      next: (v) =>  { 
        this.businessList=v
      },
      error: (e) => {console.log(e)},
      complete: () => console.info('complete')
    })
  }

}
