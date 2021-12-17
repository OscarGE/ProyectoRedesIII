import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BusinessService} from '../../services/business_service/business.service'

@Component({
  selector: 'app-view-the-business',
  templateUrl: './view-the-business.component.html',
  styleUrls: ['./view-the-business.component.css']
})
export class ViewTheBusinessComponent implements OnInit {
  userId="";
  idBusiness:any;
  business:any;
  typeList:any=[];
  contactList:any=[];
  latitude= 19.4978;
  longitude= -99.1269;
  zoom=4;
  constructor(private router: Router, private  route: ActivatedRoute,private businessService:BusinessService) { }

  ngOnInit(): void {
    window.scrollTo(0,0)
    if (localStorage.getItem('sesion')) {
      const sesion = localStorage.getItem('sesion'); 
      let value = " " + sesion + " ";
      this.userId=JSON.parse(value)["id"];
      this.idBusiness = this.route.snapshot.paramMap.get('id_business');
      this.businessService.getTheBusiness(this.idBusiness)
      .subscribe({
          next: (v) =>  { 
            this.business=v;
            this.business=this.business[0];
            this.typeList=this.business.type.split(",")
            this.contactList=this.business.contact.split(",")
            this.setLocation();
          },
          error: (e) => {console.log(e)},
          complete: () => console.info('complete')
        })
    } else {
      location.replace('');
    }
  }

  public setLocation(){
    this.latitude=this.business.latitude;
    this.longitude=this.business.longitude;
    this.zoom=15;
  }
}
