import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { auth } from "@/auth";
import { ListingType } from "@/types";
import { LISTINGS_QUERY } from "@/sanity/lib/queries";
import { SearchModal } from "@/components/SearchModal";
import ListingCard from "@/components/ListingCard";

export default async function AllListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const query = (await searchParams).query || null;
  const category = (await searchParams).category || null;
  const params = { search: query || null, category: category || null };

  const session = await auth();

  const { data: listings } = await sanityFetch({
    query: LISTINGS_QUERY,
    params,
  });

  const displayText = category
    ? `Listings in ${category}`
    : query
      ? `Search results for ${query}`
      : "All Listings";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
        <h1 className="text-4xl font-bold">All Listings</h1>
        <SearchModal query={query ?? ""} />
        <h2 className="text-2xl font-bold">{displayText}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings?.map((listing: any) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              id={listing._id}
              createdAt={listing._createdAt}
              currentUser={session?.user?.email as string}
              author={listing.author}
              contact={listing.contact}
              title={listing.title}
              description={listing.description}
              toolDetails={listing.toolDetails}
              category={listing.category}
              condition={listing.condition}
              image={listing.image}
              price={listing.price}
            />
          ))}
        </div>
      </main>
    </Suspense>
  );
}
