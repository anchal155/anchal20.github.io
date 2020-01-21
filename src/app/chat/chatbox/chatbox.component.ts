import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServiceService } from './../../service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from './../../socket.service';
import { FirstCharComponent } from '../../shared/first-char/first-char.component';
import { ChatMessage } from './chat';



@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers:[SocketService, CookieService]

})
export class ChatboxComponent implements OnInit{

  @ViewChild( 'ScrollMe', { read: ElementRef}) 
  
  public scrollMe:ElementRef;

  public authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ijd3N3ZmR09PSiIsImlhdCI6MTU3ODU2MTg4OTg4MywiZXhwIjoxNTc4NjQ4Mjg5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6MCwiYXBpS2V5IjoiTWpFeU4yTTBPV0poT1Rsa00yTm1ORE5pTlRKaE16WTRZamRrTkRSaU16azVaakZtTmpWbVlqYzNNek0xTURKak56ZzVNelU0Wm1JNFlXVXpaR001WlRRNVpESTJabVJsTlRVd1l6VmlaR014TnpKak1UQmtZakF6TlRJellUYzBORFk0TldVMVlUUTJOVGc1WkdSbE9UZGtaREppWldSak4yTmtNVEpqWmpCbE1RPT0iLCJlbWFpbCI6ImFuY2hhbHNvbWFuaTE2QG91dGxvb2suY29tIiwibGFzdE5hbWUiOiJNYW50cmkiLCJmaXJzdE5hbWUiOiJBbmNoYWwiLCJ1c2VySWQiOiJJNUVCZzE3a0sifX0.q8og6kBDjob1xfjZ9e93qxqsBeD-yVCcuUGKYBJ4iws";
  public userInfo: any;
  public receiverId: any;
  public recieverName:any;
  public userList =[]; 
  public disconnectedSocket: boolean;  

  public scrollToChatTop:boolean= false;
  public previousChatList: any = [];
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;


  constructor(private toastr: ToastrService, public _service:ServiceService, private router:Router, private cookie:CookieService, public socket:SocketService) { }

  ngOnInit() {

    this.authToken = this.cookie.get('authToken');

    this.userInfo = this._service.getUserInfoFromLocalStorage();

    this.receiverId = this.cookie.get("receiverId");

    this.recieverName = this.cookie.get("receiverName");

    console.log(this.receiverId, this.recieverName);

    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId, this.recieverName);
    }

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList();

    this.getMessageFromAUser(); 

  }

  public checkStatus = () => {
     
   if(this.cookie.get('authToken') === undefined || this.cookie.get('authToken')=== '' || this.cookie.get('authToken')=== null ) {

     this.router.navigate(['/']);

    return false;

    }

    else { 

      return true;
    }

  }// end of checkStatus method 

  public verifyUserConfirmation =() => {

    this.socket.verifyUser().subscribe((data) => {

      this.disconnectedSocket = false;

      this.socket.setUser(this.authToken);

    });
  }

  public getOnlineUserList =() => {

      this.socket.onlineUserList().subscribe((userList) => {

        this.userList = [];

        for(let x in userList) {
   
          let temp = { 'userId': x, 'name':userList[x], 'unread': 0, 'chatting': false}

          this.userList.push(temp);
  }
        console.log(this.userList)
      });
  } //chat related methods.

  public getPreviousChatWithAUser = () => {
      let previousData = (this.messageList.length > 0 ? this.messageList.slice(): [] );

      this.socket.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10).subscribe((apiResponse) => {

        console.log(apiResponse);

        if(apiResponse.status == 200) {

          this.messageList = apiResponse.data.concate(previousData);
          console.log("messagelist")
        console.log(this.messageList)

        }
        else{

          this.messageList=previousData;
          this.toastr.warning('No message Available') 
         }
        this.loadingPreviousChat = false;
        },
         (err) => {

        this.toastr.error("some error occured")
      });

  } // End of getPreviousChatWithUser

  public loadEarlierPageofChat: any = () => {

    this.loadingPreviousChat = true;

    this.pageValue++;

    this.scrollToChatTop = true;

    this.getPreviousChatWithAUser()
  } // end of loadPreviousChat

  public userSelectedToChat: any = (id, name) => {

    console.log("setting user as active")

    this.userList.map((user) => {
      if(user.userId==id){
        user.chatting = true;
      }

      else{
        user.chatting = false;
      }
    })

    this.cookie.set('receiverId', id);

    this.cookie.set('recieverName', name);

    this.recieverName = name;

    this.receiverId = id;

    this.messageList = [];

    this.pageValue = 0;

    let chatDetails = {
      userId:this.userInfo.userId,
      senderId:id
        }

    this.socket.markChatAsSeen(chatDetails);

    this.getPreviousChatWithAUser();
  } // end user btnclick function


  public sendMessageUsingKeypress: any = (event: any) => {

    if(event.keyCode === 13) { // 13 is kycode for enter

    this.sendMessage();

    } 
  } // end sendMessageUskeypress 

  public sendMessage: any = () => {

    if (this.messageText) {

      let chatMsgobject: ChatMessage = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        recieverName: this.cookie.get('recieverName'),
        receiverId : this.cookie.get('recieverId'),
        message: this.messageText,
        createdOn: new Date()
      } // end of chatMsgObject

      console.log(chatMsgobject);
      this.socket.sendChatMessage(chatMsgobject)
      this.pushToChatWindow(chatMsgobject)
    }

    else{
      this.toastr.warning("text msg cant be empty");
    }
  } // end of sendMessage method

  public pushToChatWindow: any = (data) => {
    this.messageText= '';
    this.messageList.push(data);
    this.scrollToChatTop = false;

  } //end of pushToChatWindow method

  public getMessageFromAUser: any = () => {

      this.socket.chatByUserId(this.userInfo.userId).subscribe((data) => {

        (this.receiverId==data.senderId)?this.messageList.push(data): '';
        
        this.toastr.success(`${data.senderName} says : ${data.message}`)

        this.scrollToChatTop = false;
      
      })
  } // end of message from a user

  public logout: any =() => {

    this._service.logout().subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        console.log("logout called")
        this.cookie.delete(this.authToken);
        this.cookie.delete('receiever Id');
        this.cookie.delete('receiever Name');

        this.socket.exitSocket()

        this.router.navigate(['/']);
      }

      else {
        this.toastr.error("apiResponse.message")
      } // end condition

    }, (err) => {
      this.toastr.error("some error occured")
    }); //observer end

  }// method end

  public showUserName = (name:string) => {

    this.toastr.success("You are Chatting with" +name)
  }


}
