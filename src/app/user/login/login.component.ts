import { Component, OnInit } from '@angular/core';
import { ServiceService } from './../../service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CookieService]
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(private toastr: ToastrService, public _service:ServiceService, private router:Router, private cookie:CookieService) { }

  ngOnInit() {

  }

    public goToSignUp:any = () => {

      this.router.navigate([ '/sign-up']);
    }

    public signInFunction: any = () => {

      if(!this.email){
        this.toastr.warning('enter email address')
      } else if(!this.password){
        this.toastr.warning('enter the password')
      }
       else {
          let data = {
            email: this.email,
      password: this.password,
        }
        console.log(data);

        this._service.signInFunction(data).subscribe((apiResponse) => {
        
         if(apiResponse.status == 200) {

          console.log(apiResponse);
        
         this.cookie.set('authToken', apiResponse.data.authToken);
          this.cookie.set('receiverId', apiResponse.data.userDetails.userId);
          this.cookie.set('receiverName', apiResponse.data.userDetails.firstName + '' + apiResponse.data.userDetails.lastName);
          this._service.setUserInfoInLocalStorage(apiResponse.data.userDetails)

          this.router.navigate(['/chat']);
        
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (err) => {
          this.toastr.error("some error occured");
        })

      }
    }
  }
