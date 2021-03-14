export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
  user: IUser;
  comments: IComment[];
}

export interface IComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface IUser {
  id: number;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: { name: string; catchPhrase: string; bs: string };
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
}
