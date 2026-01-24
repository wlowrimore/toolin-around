import { auth } from "@/auth";
import { createListingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Suspense } from "react";
import { LoadingBar } from "@/app/(root)/components/LoadingAnimations";
import ListerProfileListingCard from "@/app/(root)/components/ListerProfileListingCard";

// Add params to the page props to get the author ID from the URL
export default async function ListerProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const query = (await searchParams).query || null;
  const authorId = (await params).id; // Get the author ID from the URL params

  const queryParams = {
    search: query || null,
    authorId: authorId, // Pass the author ID to the query
    category: null,
  };

  const session = await auth();

  if (!session) {
    return (
      <div className="w-full flex justify-center items-center">
        <h1 className="text-slate-600 text-3xl font-semibold">
          You must be signed in to view this profile
        </h1>
      </div>
    );
  }

  const listingsQuery = createListingsQuery(queryParams);

  // Fetch listings filtered by author ID
  const { data: listings } = await sanityFetch({
    query: listingsQuery,
  });

  const listersFirstName = listings?.[0]?.author.name.split(" ")[0] + "'s";

  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6">
      <Suspense fallback={<LoadingBar />}>
        <header className="flex items-center w-full border-b-[0.025rem] border-slate-300 py-2">
          <h1 className="text-slate-600 text-3xl font-semibold">
            {listersFirstName} Listings
          </h1>
        </header>
        <div className="w-full mt-8">
          {listings && listings.length > 0 ? (
            <ListerProfileListingCard
              listings={listings}
              listingId={authorId}
            />
          ) : (
            <div className="col-span-4 text-center py-10">
              <p className="text-slate-400">
                No listings found for this author
              </p>
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
}
