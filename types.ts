export interface ListingType {
  _id: string;
  _type: "listing";
  title: string | null;
  slug: {
    current: string;
    _type: "slug";
  };
  createdAt: string;
  description: string | null;
  category: string | null;
  condition: string | null;
  image: string | null;
  deleteToken: string | null;
  toolDetails: string | null;
  price: string | null;
  ratePeriod: "hour" | "day" | "week";
  contact: string | null;
  author: {
    _id: string;
    name: string;
    image: string;
    email: string;
  } | null;
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
  ratePeriod: ListingType["ratePeriod"];
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
