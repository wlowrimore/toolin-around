import { auth } from "@/auth";
import ListingCard from "@/components/ListingCard";
import UserProfileListingCard from "@/components/UserProfileListingCard";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { LISTINGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

export interface UserProfileListingType {
  usersListings: [
    {
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
    },
  ];
}

export interface UserProfilePageProps {
  params: {
    userListing: UserProfileListingType;
    usersListings: UserProfileListingType;
  };
}

const UserProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.email) return notFound();

  const { data: usersListings } = await sanityFetch({
    query: LISTINGS_BY_AUTHOR_QUERY,
    params: {
      authorId: await client.fetch(
        `*[_type == "author" && email == $email][0]._id`,
        { email: session.user.email }
      ),
    },
  });

  console.log("USERS LISTINGS:", usersListings);
  console.log(typeof usersListings);
  console.log(usersListings.length);

  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
      <div className="w-full mt-10 px-6">
        <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
          <h1 className="text-slate-600 text-3xl font-semibold">
            {session?.user?.name}&apos;s Profile
          </h1>
          <h2 className="text-slate-500 text-xl">
            View, Edit, and Delete Your Listings Here
          </h2>
        </header>
        <div className="my-10 border-2 bg-cyan-700 border-cyan-700 p-1 w-fit">
          <Image
            src={session?.user?.image || ""}
            alt={session?.user?.name || ""}
            width={1000}
            height={1000}
            className="w-24 h-auto"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {usersListings?.map((userListing: any) => (
            <UserProfileListingCard
              key={userListing._id}
              userListing={userListing}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
