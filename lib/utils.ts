import { auth } from "../auth";
import { client } from "@/sanity/lib/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// GET LISTING RATINGS INTERFACE

export interface Rating {
  _id: string;
  rating: ListingData;
  ratings: number[];
  ratingInfo: {
    listingId: string;
    lenderId: string;
  };
  ratingKey: string | undefined;
  review?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}

// RATINGS FUNCTION

export interface RatingData {
  _id: string;
  rating: number | null;
  ratings: number[];
  ratingInfo: {
    listingId: string;
    lenderId: string;
  };
  ratingKey: string | undefined;
  review: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface ListingData {
  ratings?: RatingData[];
  _id?: string;
  author?: {
    _id?: string;
  };
}

export const ratingsUtils = {
  extractRatings(listingData: ListingData): RatingData[] {
    if (!listingData?.ratings || !Array.isArray(listingData.ratings)) {
      return [];
    }

    return listingData.ratings.map((rating) => ({
      _id: rating._id,
      rating: rating.rating,
      ratings: [], // Initialize empty array for individual ratings
      ratingInfo: {
        listingId: listingData._id || "",
        lenderId: listingData.author?._id || "",
      },
      ratingKey: rating._id,
      review: rating.review || "",
      createdAt: rating.createdAt,
      user: {
        id: rating.user?.id || "",
        name: rating.user?.name || "",
        email: rating.user?.email || "",
        image: rating.user?.image,
      },
    }));
  },

  calculateAverageRating(ratings: RatingData[]) {
    if (!ratings || ratings.length === 0) return 0;
    const validRatings = ratings.filter((r) => r.rating !== null);
    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return Number(sum / validRatings.length);
  },

  formatRatingDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function displayTagName() {
  const session = await auth();
  const email = session?.user?.email;
  const nameTag = email?.split("@")[0].toLowerCase();
  return `@${nameTag}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}

export function timeLimit(time: number) {
  const timer = setTimeout(() => {});
}

export function extractPublicIdFromUrl(url: string) {
  try {
    const match = url.match(/https?:\/\/[^\/]+\/([^\/]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

// GET RATINGS BELONGING TO TYPE RATINGDATA

export async function getRatingsData(listingId: string): Promise<RatingData[]> {
  try {
    if (!listingId) {
      console.warn("No listingId provided to getRatingsData");
      return [];
    }
    const ratings = await client.fetch<RatingData[]>(
      `*[_type == "rating" && listing._ref == $listingId] | order(createdAt desc) {
        _id,
        rating,
        review,
        createdAt,
        user->{
          _id,
          name,
          email,
          image
        }
      }`,
      { listingId }
    );
    return ratings || [];
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return [];
  }
}

// GET RATINGS FOR SERVER-SIDE COMPONENTS

export async function getRating(listingId: string): Promise<RatingData[]> {
  try {
    if (!listingId) {
      console.warn("No listingId provided to getRatings");
      return [];
    }

    const rating = await client.fetch<RatingData[]>(
      `*[_type == "rating" && listing._ref == $listingId] | order(createdAt desc) {
        _id,
        rating,
        review,
        createdAt,
        user->{
          _id,
          name,
          email,
          image
        }
      }`,
      { listingId }
    );

    return rating || [];
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return [];
  }
}

// GET AVERAGE RATING FOR SERVER-SIDE COMPONENTS

export async function getAverageRating(listingId: string): Promise<number> {
  try {
    if (!listingId) {
      console.warn("No listingId provided to getAverageRating");
      return 0;
    }

    const result = await client.fetch<{ averageRating: number }>(
      `{
        "averageRating": (*[_type == "rating" && listing._ref == $listingId].rating)
      }`,
      { listingId }
    );

    return Number(result.averageRating) || 0;
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return 0;
  }
}

// FUNCTION FOR GETTING BOTH RATINGS AND AVERAGE RATING

export async function getlistingRatings(listingId: string): Promise<{
  ratings: Rating[];
  averageRating: number;
}> {
  try {
    if (!listingId) {
      console.warn("No listingId provided to getListingRatings");
      return { ratings: [], averageRating: 0 };
    }

    const result = await client.fetch<{
      ratings: Rating[];
      averageRating: number;
    }>(
      `{
        "ratings": *[_type == "rating" && listing._ref == $listingId] | order(createdAt desc) {
          _id,
          rating,
          review,
          createdAt,
          user->{
            _id,
            name,
            email,
            image
          }
        },
        "averageRating": (*[_type == "rating" && listing._ref == $listingId].rating)
      }`,
      { listingId }
    );

    return {
      ratings: result.ratings || [],
      averageRating: Number(result.averageRating) || 0,
    };
  } catch (error) {
    console.error("Error fetching listing ratings:", error);
    return { ratings: [], averageRating: 0 };
  }
}

// CALCULATE AVERAGE RATING

export async function calculateAverageRating(ratings: any[]) {
  try {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
}

// CREATE USER UTILITY FUNCTION

export const createValidId = (email: string) => {
  return `author-${email.replace(/[@.]/g, "-")}`;
};

export const createOrUpdateUser = async (userData: {
  email: string;
  name: string;
  image?: string;
}) => {
  const userId = createValidId(userData.email);

  try {
    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "author" && _id == $userId][0]`,
      { userId }
    );

    if (!existingUser) {
      // Create new user
      const newUser = {
        _id: userId,
        _type: "author",
        name: userData.name,
        email: userData.email,
        image: userData.image || "",
        roles: ["user"],
      };

      await client.createIfNotExists(newUser);
      return newUser;
    }

    // Update existing user
    const updatedUser = {
      ...existingUser,
      name: userData.name,
      image: userData.image || existingUser.image,
    };

    await client.patch(userId).set(updatedUser).commit();
    return updatedUser;
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
};

// ENVIRONMENT VARIABLES CONFIGURATION

export const env = {
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_STUDIO_API_VERSION ||
    "2024-01-01",
};

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
