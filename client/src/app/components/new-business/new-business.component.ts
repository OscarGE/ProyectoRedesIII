import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/models/User';
import { Business } from 'src/app/models/Business';
import { UserService } from './../../services/user_service/user.service';
import { BusinessService } from './../../services/business_service/business.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


@Component({
  selector: 'app-new-business',
  templateUrl: './new-business.component.html',
  styleUrls: ['./new-business.component.css']
})
export class NewBusinessComponent implements OnInit {
  userId=""
  user!: User;
  business!: Business;
  fullname: any;
  typeContactList: string[] = ["Teléfono", "e-mail", "Website", "Facebook", "Twitter", "Instagram"];
  canAddContact=false //Variable que deshabilita el botón de añadir contacto
  @ViewChild('type') type?:ElementRef;
  @ViewChild('contact') contact?:ElementRef;
  @ViewChild("placesRef") placesRef! : GooglePlaceDirective;
  typeList:any=[];
  contactList:any=[];
  categoriesList:any=[];
  categoriesIdList:any=[];
  form!: FormGroup; //Formulario reactivo 
  existeName: boolean = false;
  options={
    types: ['address'],
    componentRestrictions: { country: 'MX' }
  } as Options;
  latitude= 19.4978;
  longitude= -99.1269;
  zoom=4;
  //Para trabajar con la imagen 
  public previsualizacion!: string;
  //Para el envío de la foto
  file!: File; //campo necesario para el FromData
  //Asignación de tipo de cuenta
  constructor(private formBuilder: FormBuilder, private userService :UserService, private businessService :BusinessService, private sanitizer: DomSanitizer) { 
    this.buildForm();
  }

  ngOnInit(): void {
    window.scrollTo(0,0)
    if (localStorage.getItem('sesion')) {
      this.setCurrentLocation();
      const sesion = localStorage.getItem('sesion'); 
      let value = " " + sesion + " ";
      this.userId=JSON.parse(value)["id"];
      this.userService.getUser(JSON.parse(value)["id"])
      .subscribe({
        next: (v) =>  { 
          this.user=v
          this.fullname=this.user.name+" "+this.user.second_name+" "+this.user.third_name;
        },
        error: (e) => {console.log(e)},
        complete: () => console.info('complete')
      })
      this.businessService.categoriesList()
      .subscribe({
        next: (v) =>  { 
          for(var i=0; i<Object.keys(JSON.parse(JSON.stringify(v))).length; i++){
            this.categoriesList.push(JSON.parse(JSON.stringify(v))[i].category);
            this.categoriesIdList.push(JSON.parse(JSON.stringify(v))[i].id);
          }
        },
        error: (e) => {console.log(e)},
        complete: () => console.info('complete')
      })
    } else {
      location.replace('');
    }
  }
  public handleAddressChange(address: Address) {
    this.latitude=address.geometry.location.lat();
    this.longitude=address.geometry.location.lng();
    this.zoom=15;
    this.form.controls['address'].setValue(address.formatted_address);
    this.form.controls['latitude'].setValue(this.latitude);
    this.form.controls['longitude'].setValue(this.longitude);
  }
  public setCurrentLocation(){
    navigator.geolocation.getCurrentPosition(position=>{
      this.latitude=position.coords.latitude;
      this.longitude=position.coords.longitude;
      this.zoom=15;
    },err=>{console.log(err.message)})
    
  }

 private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      id_category : ['', [Validators.required]],
      type: ['',],
      contact: ['',],
      typeList: new FormArray([], [Validators.required]),
      contactList: new FormArray([], [Validators.required]),
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      address: ['', [Validators.required]],
      photo: [null,]
    });
    //Evaluación reactiva
    this.form.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(value => {
      if(value.type=="" || value.contact==""){
        this.canAddContact=false
      }
      else{
        this.canAddContact=true
      }
      //Verificar si existen coincidencias en la base de datos
      if(value.name){
        this.businessService.verifyBusiness(value.name)
        .subscribe({
          next: (v) =>  { 
              if(JSON.parse(JSON.stringify(v)).message =='Existe'){
                this.existeName=true;
              }else if(JSON.parse(JSON.stringify(v)).message=='No existe'){
                this.existeName=false;
              }
            },
          error: (e) => {},
        })
      }
    })   
  }

  addContact(){
    const typeArray: FormArray = this.form.get('typeList') as FormArray;
    const contactArray: FormArray = this.form.get('contactList') as FormArray;
    typeArray.push(new FormControl(this.form.value.type));
    contactArray.push(new FormControl(this.form.value.contact)); 
    this.canAddContact=false;
    this.typeList.push(this.form.value.type)
    this.contactList.push(this.form.value.contact)
    this.form.get('type')?.setValue("");
    this.form.get('contact')?.setValue("");
    this.type!.nativeElement.value="";
    this.contact!.nativeElement.value="";
  }
  deleteContact(i:number){
    this.typeList.splice(i,1);
    this.contactList.splice(i,1);
    const typeArray: FormArray = this.form.get('typeList') as FormArray;
    const contactArray: FormArray = this.form.get('contactList') as FormArray;
    typeArray.removeAt(i);
    contactArray.removeAt(i);
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
  sendbusiness(event: Event) {
    event.preventDefault();
    const value = this.form.value;
    this.business= {
      id_user: parseInt(this.userId),
      name: value.name,
      description: value.description,
      id_category: value.id_category,
      type: value.typeList,
      contact: value.contactList,
      latitude: value.latitude,
      longitude: value.longitude,
      address: value.address
    };
let timerInterval:any
Swal.fire({
  title: 'Subiendo datos',
  html: 'Tiempo restante: <b></b>',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b:any = Swal.getHtmlContainer()?.querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft();
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})
    this.businessService.loadImg(value.name, this.previsualizacion).then(urlImagen=>{
      this.business.urlimg=urlImagen?.toString();
      this.businessService.saveBusiness(this.business)
      .subscribe({
        next: (v) => { 
          Swal.fire(
            'Negocio creada con éxito',
            '',
            'success'
          ).then((result) => {
            location.replace('/happydeal/home');
          })
        },
        error: (e) => {console.error(e)},
        complete: () => console.info('complete') 
      })      
      
    })
   
  }
   
}
