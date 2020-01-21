import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private url = 'https://chatapi.edwisor.com';
  public authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ijd3N3ZmR09PSiIsImlhdCI6MTU3ODU2MTg4OTg4MywiZXhwIjoxNTc4NjQ4Mjg5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6MCwiYXBpS2V5IjoiTWpFeU4yTTBPV0poT1Rsa00yTm1ORE5pTlRKaE16WTRZamRrTkRSaU16azVaakZtTmpWbVlqYzNNek0xTURKak56ZzVNelU0Wm1JNFlXVXpaR001WlRRNVpESTJabVJsTlRVd1l6VmlaR014TnpKak1UQmtZakF6TlRJellUYzBORFk0TldVMVlUUTJOVGc1WkdSbE9UZGtaREppWldSak4yTmtNVEpqWmpCbE1RPT0iLCJlbWFpbCI6ImFuY2hhbHNvbWFuaTE2QG91dGxvb2suY29tIiwibGFzdE5hbWUiOiJNYW50cmkiLCJmaXJzdE5hbWUiOiJBbmNoYWwiLCJ1c2VySWQiOiJJNUVCZzE3a0sifX0.q8og6kBDjob1xfjZ9e93qxqsBeD-yVCcuUGKYBJ4iws"

  constructor(public https:HttpClient, private _cookie:CookieService) { }

  public getUserInfoFromLocalStorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));
  }//

  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public signUpFunction(data): Observable<any> {

    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobile', data.mobile)
    .set('email', data.email)
    .set('password', data.password)
    .set('apiKey', data.apiKey);

    return this.https.post(`${this.url}/api/v1/users/signup`, params);

  }

  public signInFunction(data):Observable<any> {

    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);

    return this.https.post(`${this.url}/api/v1/users/login`, params);
  }

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set(this.authToken, this._cookie.get('this.authToken'))

    return this.https.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

    private handleError(err:HttpErrorResponse) {

      let errorMessage = '';

      if (err.error instanceof Error ){
        errorMessage = `An error occured: ${err.error.message}`;
      } else {

        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  
      } // end condition *if
  
      console.error(errorMessage);
  
      return Observable.throw(errorMessage);
  
    }  // END handleError

    }
  

