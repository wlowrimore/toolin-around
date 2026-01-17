import { auth } from "@/auth";
import ListingCard from "@/app/(root)/components/ListingCard";
import UserProfileListingCard from "@/app/(root)/components/UserProfileListingCard";
import { User } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { LISTINGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { Gem, MoveRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FeatureButton from "../../components/feature-signup/FeatureButton";
import FeatureModal from "../../components/feature-signup/FeatureModal";
import CTA from "../../components/feature-signup/CTA";

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
    availability: boolean;
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
          availability,
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

    const result = await Promise.race([
      client.fetch(query, { email: session.user.email }),
    ]);

    if (!result) {
      throw new Error("No data returned from Sanity");
    }

    const usersListings: UserProfileListingType[] = result.listings || [];

    return (
      <main className="max-w-7xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
        <div className="w-full my-10 px-6">
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
            <div className="flex flex-col w-[50%]">
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
                    <Star size={22} strokeWidth={0.5} fill="#facc15" />
                  </span>
                </p>
              </div>
            </div>
            <CTA isOpen />
            {/* <section className="max-w-[50%] flex flex-col py-2 px-4 bg-black">
              <h3 className="text-lg font-semibold text-white mb-3">
                You are not a featured lister. Let&apos;s change that!
              </h3>
              <p className="text-sm text-neutral-300 -mt-4">
                By signing up as a featured user, you&apos;ll be able to
                showcase your listings to a wider audience, attract more
                interest in your products, and boost your visibility.
              </p>
              <FeatureModal isOpen={isOpen} />
              <FeatureButton />
              <button
                type="button"
                title="Sign up as a featured user"
                onClick={() => null}
                className="w-fit pr-2 pl-1 py-1 bg-sky-600 flex items-center gap-1 mt-1 rounded-sm border border-sky-500 hover:bg-sky-500 hover:text-slate-800 hover:border-sky-600 transition-colors duration-200"
              >
                <Gem size={22} strokeWidth={0.5} fill="#7dd3fc" />
                <span className="text-white text-sm">Let&apos;s Go</span>
              </button>
            </section> */}
          </div>
          {/* Listings grid */}
          <div className="bg-black grid grid-cols-1 sm:grid-cols-2 gap-1 mt-8">
            {usersListings.length > 0 ? (
              usersListings.map((userListing: any) => (
                <UserProfileListingCard
                  key={userListing._id}
                  userListings={[userListing]}
                />
              ))
            ) : (
              <Link
                href="/list-tools"
                className="flex mt-24 justify-center items-center text-sky-800 hover:text-sky-600 hover:underline col-span-4 text-xl w-full"
              >
                <p className="w-fit p-2">
                  Let&apos;s add some listings to your profile!
                </p>
              </Link>
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
