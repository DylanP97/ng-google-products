export class Product {
  _id!: string;
  name!: string;
  category!: string;
  description!: string;
  dbDate!: string;
  dbYear!: number;
  dbEndDate?: string;
  dbEndYear?: number;
  dbYearDuration?: number;
  dbYearsDuration?: number[];
  likes!: number;
  dislikes!: number;
  imageUrl!: string;
  usersLiked!: string[];
  usersDisliked!: string[];
  userId!: string;
}
