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
    likened: boolean
  }

  interface IUnLikedUser {
    fromUserId: string,
    toUserId: string,
    action: string,
    name: string,
    othername: string,
    photo: string
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
    profileVisibility: string,
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
