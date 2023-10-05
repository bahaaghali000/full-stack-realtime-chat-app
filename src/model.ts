export interface User {
    uid: string ;
    displayName: string | null;
    email?: string;
    photoURL: string | null;
    text?: string; 
    sender?: User
}
export interface UserChange extends User {
    combinedId: string;
}


export interface MessageData  {
    date: {
        nanoseconds: number,
        seconds: number
    },
    id: string,
    senderId: string,
    text: string,
    img?: string,
}

export interface MessageProps {
    message: MessageData,
    messages: MessageData[]
}

