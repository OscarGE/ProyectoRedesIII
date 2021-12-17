import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
firebase.initializeApp(environment.firebaseConfig);
import { Business } from '../../models/Business'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  storeRef = firebase.app().storage().ref();
  API_URI = 'http://localhost:3000/api' //Como atributo la dirección del servidor

  constructor(private http: HttpClient) { }
  getTheBusiness(id_business : string): Observable<Business> {
    return this.http.get(`${this.API_URI}/business/one/${id_business}`)
  }
  getBusiness(): Observable<Business> {
    return this.http.get(`${this.API_URI}/business/listAll`);
  }
  getMyBusiness(id_user: string): Observable<Business>{
    return this.http.get(`${this.API_URI}/business/list/${id_user}`)
  }
  deleteBusiness(id: string): Observable<Business> {
    return this.http.delete(`${this.API_URI}/business/${id}`);
  }
  saveBusiness(business: Business): Observable<Business> {
  
    return this.http.post(`${this.API_URI}/business/`, business);
  }
  verifyBusiness(business: string){
    return this.http.get(`${this.API_URI}/business/verify-isExistBusiness/${business}`);
  }
  updateBusiness(id: any, updateBusiness: Business): Observable<Business>{
    return this.http.put(`${this.API_URI}/business/${id}`, updateBusiness);
  }
  categoriesList(): Observable<Business>{
    return this.http.post(`${this.API_URI}/business/get-categoriesList`,null);
  }
  async loadImg(name: string, imgBase64: any){
    try{
      let respuesta = await this.storeRef.child("business/"+name).putString(imgBase64, 'data_url');
      return respuesta.ref.getDownloadURL();
    }catch(err){
      console.log(err);
      return null;
    }
  }
 
}

