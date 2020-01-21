import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

 

// routing 
import { RouterModule, Routes } from '@angular/router';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import {ServiceService} from './service.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChatModule,
    UserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path:'login', component:LoginComponent, pathMatch:'full' },
      { path: '', redirectTo:'login', pathMatch: 'full' },
      {path: '*', component:LoginComponent },
      {path:'**', component:LoginComponent }
    ])
  ],

  providers: [CookieService, ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
