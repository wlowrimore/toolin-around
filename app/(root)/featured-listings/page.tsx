import { auth } from "@/auth";
import { PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { ListingCardProps } from "@/types";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import ListingCard from "@/components/ListingCard";
import { getTopListingsForWeek, generateWeekCycles } from "@/lib/utils";
import Link from "next/link";

interface Listing {
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
  ratings: any[];
  author: {
    _id: string;
    name: string;
    slug: string | null;
    image: string;
    email: string;
  };
}

interface FeaturedListings {
  data: {
    select: Listing[];
  };
}

const FeaturePage: React.FC<ListingCardProps> = async ({
  listing,
  createdAt,
  id,
  title,
  description,
  price,
  image,
  category,
  condition,
  contact,
  author,
  toolDetails,
}) => {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  const query = PLAYLIST_BY_SLUG_QUERY;

  const params = { slug: "featured-listings" };
  console.log("PARAMS IN FEATURED LISTINGS:", params);
  const response = await sanityFetch<any>({
    query,
    params,
  });

  if (!response) {
    return (
      <div className="w-full p-4 h-[96vh] flex items-center justify-center">
        <h1 className="text-2xl font-normal text-slate-800 tracking-wide">
          There are no featured listings at this time. Please check back later.
        </h1>
      </div>
    );
  }

  const listings = response.data?.select;
  console.log("LISTINGS IN FEATURED LISTINGS:", listings);

  const weekCycles = generateWeekCycles(4);
  const topListingsPerWeek = weekCycles.map((cycle) => ({
    ...cycle,
    listings: getTopListingsForWeek(listings, cycle.start, cycle.end),
  }));

  return (
    <Suspense
      fallback={
        <div className="absolute z-60 top-[30%] left-[30%] flex items-center justify-center text-xl text-cyan-700 animate-pulse">
          Loading...
        </div>
      }
    >
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
        <div className="w-full mt-10 px-6">
          <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
            <h1 className="text-slate-600 text-3xl font-semibold">
              Featured Listings
            </h1>
            <h2 className="text-lg text-slate-600">
              Here are the top 3 rated listings for the week of{" "}
              <span className="font-bold text-cyan-600">
                {topListingsPerWeek[0].start.toLocaleDateString()} -{" "}
                {topListingsPerWeek[0].end.toLocaleDateString()}
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-3 gap-4 text-xl items-center py-6">
            {listings.length > 0 &&
              listings.map((listing: any) => (
                <ListingCard
                  key={listing?._id}
                  listing={listing}
                  createdAt={listing?._createdAt}
                  id={listing?._id}
                  title={listing?.title}
                  image={listing?.image}
                  category={listing?.category}
                  condition={listing?.condition}
                  price={listing?.price}
                  contact={listing?.contact}
                  description={listing?.description}
                  author={listing?.author}
                  toolDetails={listing?.toolDetails}
                />
              ))}
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default FeaturePage;
