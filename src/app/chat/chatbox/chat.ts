export interface ChatMessage {
        chatId?:string,
        message:string,
        createdOn:Date,
        receiverId: string,
        recieverName: string,
        senderId: string,
        senderName: string
}