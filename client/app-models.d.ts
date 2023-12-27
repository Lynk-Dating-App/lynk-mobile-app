declare module '@app-models' {
  interface IPermission {
    permission_id: number;
    name: string;
    action: string;
    subjection: string;
  }

  interface IJobs {
    _id: any;
    name: string;
    slug: string;
    status: string;
  }

  interface IPreference {
    pAbout: string,
    pMinAge: string,
    pMaxAge: string,
    pGender: string,
    pState: string,
    pMinHeight: string,
    pMaxHeight: string
  }

  interface ILikedUser{
    fromUserId: string,
    toUserId: string,
    action: string,
    name: string,
    othername: string,
    photo: string,
    likened: boolean,
    age: string
  }

  interface IUnLikedUser {
    fromUserId: string,
    toUserId: string,
    action: string,
    name: string,
    othername: string,
    photo: string
  }

  interface IUserById {
    firstName: string,
    profileImageUrl: string,
    age: number,
    likedUsers: string[],
    _id: string,
  }

  interface IUserChats {
    _id: string,
    members: string[],
    chat?: any,
    createdAt?: Date,
    updatedAt?: Date,
    firstName?: string,
    profileImageUrl?: string
  }

  interface IMember {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    chat: any[]
  }

  interface OnlineUsers {
    userId: string;
    socketId: string;
  }

  interface IPlan {
    _id: string;
    name: string;
    slug: string;
    price: string | '';
    duration: number | null;
    durationUnit: string | null;
  }

  interface IChangePassword {
    currentPassword: string,
    password: string,
    confirmPassword: string
  }

  interface IChatMessage {
    _id: string;
    senderId: string;
    chatId: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
    receiverStatus: string;
    senderStatus: string;
  }

  interface INotification {
    _id: string;
    notification: string;
    senderId: string;
    image: string;
    age: string;
    status: boolean;
    user: any;
    name: string;
    createdAt: Date;
  }

  interface ILikedAndLikedByUsers {
    key: string,
    firstName: string,
    profileImage: string
  }
  
  interface IMatch {
    _id: any,
    subscription: any | null,
    preference: IPreference,
    likedUsers: string[],
    likedByUsers: string[],
    gallery: string[],
    interests: string[],
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    gender: string,
    profileImageUrl: string,
    active: boolean,
    verify: string,
    profileVisibility: boolean,
    planType: string,
    about: string,
    height: string,
    distance: string,
    age: number,
    jobDescription: string,
    jobType: string,
    address: string,
    state: string
  }

}
