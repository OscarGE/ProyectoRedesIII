import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user_service/user.service';
import { BusinessService } from './../../services/business_service/business.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  businessList:any;
  idUser:any;
  constructor(private userService :UserService, private businessService :BusinessService) { }

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion'); 
    let value = " " + sesion + " ";
    this.idUser=JSON.parse(value)["id"]
    this.businessService.getBusiness()
    .subscribe({
      next: (v) =>  { 
        this.businessList=v
      },
      error: (e) => {console.log(e)},
      complete: () => console.info('complete')
    })

  }


}
