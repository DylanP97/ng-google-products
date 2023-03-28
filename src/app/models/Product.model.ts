import { User } from "./User.model";

export class Product {
  _id!: string;
  name!: string;
  category!: string;
  description!: string;
  yearLaunched!: string;
  likes!: number;
  dislikes!: number;
  imageUrl!: string;
  website!: string;
  usersLiked!: string[];
  usersDisliked!: string[];
  userId!: string;
  username!: string;
  user?: User | null;
}
