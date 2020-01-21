import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'https://chatapi.edwisor.com';
  private socket;
  public authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ijd3N3ZmR09PSiIsImlhdCI6MTU3ODU2MTg4OTg4MywiZXhwIjoxNTc4NjQ4Mjg5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6MCwiYXBpS2V5IjoiTWpFeU4yTTBPV0poT1Rsa00yTm1ORE5pTlRKaE16WTRZamRrTkRSaU16azVaakZtTmpWbVlqYzNNek0xTURKak56ZzVNelU0Wm1JNFlXVXpaR001WlRRNVpESTJabVJsTlRVd1l6VmlaR014TnpKak1UQmtZakF6TlRJellUYzBORFk0TldVMVlUUTJOVGc1WkdSbE9UZGtaREppWldSak4yTmtNVEpqWmpCbE1RPT0iLCJlbWFpbCI6ImFuY2hhbHNvbWFuaTE2QG91dGxvb2suY29tIiwibGFzdE5hbWUiOiJNYW50cmkiLCJmaXJzdE5hbWUiOiJBbmNoYWwiLCJ1c2VySWQiOiJJNUVCZzE3a0sifX0.q8og6kBDjob1xfjZ9e93qxqsBeD-yVCcuUGKYBJ4iws"

  constructor(public http:HttpClient, private _cookie:CookieService) { 

    this.socket = io (this.url);
  }

  //event to be listened 
   public verifyUser = () => {
      return Observable.create((observer) => {

        this.socket.on('verifyUser', (data) => {

          observer.next(data);
        });//end of socket

      });//end of observable

    }// end verify User

    public onlineUserList = () => {
      return Observable.create((observer) => {
        this.socket.on('online-user-list', (userList) => {
          observer.next(userList);
        }); //end socket
    }) // end of observer
  } // 

  public disconnectedSocket =() => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {

  });
});
  }


    public setUser =(authToken) => {

      this.socket.emit('set-user', authToken);
    }// end of setUser emit event 
//events to be emited 

    public markChatAsSeen = (userDetails) =>{

      this.socket.emit('mark-chat-as-seen', userDetails);
    } // ends of events to be emitted

    //chat related methods

    public getChat(senderId, receiverId, skip): Observable<any> {

      return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${this._cookie.get('authtoken')}`)

        tap(data => console.log('Data received'));
        catchError(this.handleError);
    } // end of logout function 

    public chatByUserId = (userId) => {

      return Observable.create((observer) => {

        this.socket.on(userId, (data) => {

          observer.next(data);
        }); // end socket

      }); // end observable

      } // end of chatbyUserId function 

      public sendChatMessage = (chatMsgObject) => {

        this.socket.emit('chat-msg', chatMsgObject);
      }

      public exitSocket = () => {

        this.socket.disconnect();
      }
    


    private handleError(err:HttpErrorResponse) {
      let errorMessage= '';
     
      if(err.error instanceof Error) {
        errorMessage = `An error occured: ${err.error.message}`;
      } else {
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      } // end condition if 
      console.error(errorMessage);

      return Observable.throw(errorMessage);
    } // end handling error 
  }

