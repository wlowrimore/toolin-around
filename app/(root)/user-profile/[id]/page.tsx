import { auth } from "@/auth";
import ListingCard from "@/components/ListingCard";
import UserProfileListingCard from "@/components/UserProfileListingCard";
import { User } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { LISTINGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { MoveRight, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export interface UserProfileListingType {
  userListings: {
    _id: string;
    title: string;
    description: string;
    image: string | null;
    category: string;
    condition: string;
    price: string;
    ratePeriod: string;
    author: {
      _id: string;
      name: string;
      image: string;
      email: string;
    };
    slug: string;
    _createdAt: string;
    ratings: number;
    deleteToken: string;
    toolDetails: string;
    contact: string;
  }[];
}

export interface UserProfilePageProps {
  params: {
    userListings: UserProfileListingType;
    usersListings: UserProfileListingType;
  };
}

const UserProfilePage = async () => {
  try {
    const session = await auth();

    const userFirstName = session?.user?.name?.split(" ")[0];

    if (!session?.user?.email) return notFound();

    // Optimize the query to get both author and listings in one go
    const query = `
      *[_type == "author" && email == $email][0] {
        _id,
        "listings": *[_type == "listing" && author._ref == ^._id] {
          _id,
          title,
          description,
          image,
          category,
          condition,
          price,
          ratePeriod,
          author->,
          slug,
          _createdAt,
          ratings,
          deleteToken,
          toolDetails,
          contact
        }
      }
    `;

    // Use Promise.race to implement timeout
    const result = await Promise.race([
      client.fetch(query, { email: session.user.email }),
    ]);

    if (!result) {
      throw new Error("No data returned from Sanity");
    }

    const usersListings: UserProfileListingType[] = result.listings || [];

    return (
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
        <div className="w-full mt-10 px-6">
          <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
            <h1 className="text-slate-600 text-3xl font-semibold">
              {userFirstName}&apos;s Profile
            </h1>
            <h2 className="text-slate-500 text-xl">
              View, Edit, and Delete Your Listings Here
            </h2>
          </header>
          {/* Profile image section */}
          <div className="flex items-center gap-4 my-10">
            <div className=" border-2 bg-cyan-700 border-cyan-700 p-1 w-fit">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session?.user?.name || "User profile"}
                  width={1000}
                  height={1000}
                  className="w-24 h-auto"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-300 flex items-center justify-center text-2xl">
                  {session?.user?.name?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-600 text-2xl font-semibold">
                {session?.user?.name}
              </h1>
              <p className="text-slate-500">{session?.user?.email}</p>
              {usersListings.length > 0 ? (
                <p className="flex items-center gap-3 text-slate-500">
                  Total Number of Listings :
                  <span className="underline text-blue-500">
                    {usersListings.length || null}
                  </span>
                </p>
              ) : null}
              <div className="flex items-center">
                <p className="flex text-slate-500 gap-3">
                  Your Overall Rating :
                  <span className="flex items-center">
                    <Star size={22} strokeWidth={0.5} fill="#fbbf24" />
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* Listings grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {usersListings.length > 0 ? (
              usersListings.map((userListing: any) => (
                <UserProfileListingCard
                  key={userListing._id}
                  userListings={[userListing]}
                />
              ))
            ) : (
              <p className="text-slate-500 col-span-full text-center">
                No listings found
              </p>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-xl text-red-600">
          Unable to load profile data. Please try again later.
        </h1>
        <p className="text-slate-600 mt-2">
          If this problem persists, please contact support.
        </p>
      </div>
    );
  }
};

export default UserProfilePage;
