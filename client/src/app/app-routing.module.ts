import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { HappyDealComponent } from './pages/happy-deal/happy-deal.component';
import { HomeComponent } from './components/home/home.component';
import { NewBusinessComponent } from './components/new-business/new-business.component';
import { ViewMyBusinessComponent } from './components/view-my-business/view-my-business.component';
import { ViewTheBusinessComponent } from './components/view-the-business/view-the-business.component';


const routes: Routes = [
    
  {path: 'happydeal', component: HappyDealComponent, 
      children:[
         {path: 'home', component: HomeComponent},
         {path: 'newbusiness', component: NewBusinessComponent},
         {path: 'viewmybusiness', component: ViewMyBusinessComponent},
         {path: 'viewthebusiness/:id_business', component: ViewTheBusinessComponent},
      ]
    },
    {path: 'registeruser', component:  RegisterUserComponent},
    {path: '', redirectTo: '**', pathMatch: 'full' },
    {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
