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

export interface ListingCardProps {
  id: string;
  listing: ListingType;
  currentUser?: string;
  createdAt: ListingType["createdAt"];
  author: ListingType["author"];
  category: ListingType["category"];
  condition: ListingType["condition"];
  contact: ListingType["contact"];
  image: ListingType["image"];
  price: ListingType["price"];
  title: ListingType["title"];
  description: ListingType["description"];
  toolDetails: ListingType["toolDetails"];
  handleClick?: () => void;
}

export interface Slug {
  _type: "slug";
  current: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: string | null;
  image: string;
  email: string;
}

export interface Listing {
  _id: string;
  _createdAt: string;
  title: string;
  image: string;
  slug: {
    current: string;
    _type: string;
  };
  description: string;
  category: string;
  ratings: any[]; // Define a Rating interface if needed
  author: Author;
}

export interface FeaturedListings {
  _id: string;
  title: string;
  description: null;
  ratings: any[];
  select: Listing[];
  slug: {
    current: string;
    _type: string;
  };
  category: null;
  image: null;
  toolDescription: null;
}

export interface SanityFetchResponse {
  data: FeaturedListings;
}
