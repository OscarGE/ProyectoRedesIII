import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AgmCoreModule } from '@agm/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HappyDealComponent } from './pages/happy-deal/happy-deal.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { NewBusinessComponent } from './components/new-business/new-business.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ViewMyBusinessComponent } from './components/view-my-business/view-my-business.component';

//Servicios
import { UserService } from './services/user_service/user.service';
import { BusinessService } from './services/business_service/business.service';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ViewTheBusinessComponent } from './components/view-the-business/view-the-business.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterUserComponent,
    HappyDealComponent,
    HomeComponent,
    NewBusinessComponent,
    SidebarComponent,
    BusinessListComponent,
    ChatListComponent,
    ViewMyBusinessComponent,
    ViewTheBusinessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB26gQdmlP3KOsrZPHj-YAE8yZl_OPiZOU&libraries=places&language=en', 
      libraries: ['places']
    })
  ],
  providers: [UserService,BusinessService],
  bootstrap: [AppComponent],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
