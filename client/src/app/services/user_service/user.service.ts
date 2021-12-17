
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
firebase.initializeApp(environment.firebaseConfig);
import { User } from '../../models/User'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  storeRef = firebase.app().storage().ref();

  API_URI = 'http://localhost:3000/api' //Como atributo la dirección del servidor

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User> {
    return this.http.get(`${this.API_URI}/users`)
  }
  getUser(id: any): Observable<User> {
    return this.http.get(`${this.API_URI}/users/${id}`);
  }
  deleteUser(id: string): Observable<User> {
    return this.http.delete(`${this.API_URI}/users/${id}`);
  }
  saveUser(user: User): Observable<User> {

    return this.http.post(`${this.API_URI}/users/`, user);
  }
  verifyEmail(email: string){
    return this.http.get(`${this.API_URI}/users/verify-isExistEmial/${email}`);
  }
  updateUser(id: any, updateUser: User): Observable<User>{
    return this.http.put(`${this.API_URI}/users/${id}`, updateUser);
  }
  login(user: User): Observable<User> {
    return this.http.post(`${this.API_URI}/users/login`, user);
  }
  async loadImg(email: string, imgBase64: any){
    try{
      let respuesta = await this.storeRef.child("users/"+email).putString(imgBase64, 'data_url');
      return respuesta.ref.getDownloadURL();
    }catch(err){
      console.log(err);
      return null;
    }
  }
}

