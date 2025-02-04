export interface ListingType {
  _id: string;
  _type: "listing";
  title: string | null;
  slug: Slug | null;
  createdAt: string;
  description: string | null;
  category: null;
  condition: null;
  image: null;
  deleteToken: null;
  toolDetails: null;
  price: null;
  contact: null;
  author: null;
}

export interface Slug {
  _type: "slug";
  current: string;
}
