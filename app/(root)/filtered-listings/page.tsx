// import { auth } from "@/auth";
// import { Suspense } from "react";
// import { sanityFetch } from "@/sanity/lib/live";
// import ListingCard from "@/components/ListingCard";
// import { LISTINGS_QUERY } from "@/sanity/lib/queries";

// export default async function FilteredListingsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ query?: string; category?: string }>;
// }) {
//   const query = (await searchParams).query || null;
//   const category = (await searchParams).category || null;
//   const params = { search: query || null, category: category || null };

//   const session = await auth();

//   const { data: listings } = await sanityFetch({
//     query: LISTINGS_QUERY,
//     params,
//   });

//   const displayText = query
//     ? `Search results for "${query}"`
//     : `No listings found for "${query}"`;

//   return (
//     <div>
//       <h1>{displayText}</h1>
//       <div>
//         <Suspense fallback={<div>Loading...</div>}>
//           {listings?.length > 0 &&
//             listings.map((listing: any) => (
//               <ListingCard
//                 listing={listing}
//                 key={listing._id}
//                 id={listing._id}
//                 title={listing.title}
//                 description={listing.description}
//                 createdAt={listing._createdAt}
//                 price={listing.price}
//                 image={listing.image}
//                 category={listing.category}
//                 condition={listing.condition}
//                 contact={listing.contact}
//                 author={listing.author}
//                 toolDetails={listing.toolDetails}
//               />
//             ))}
//         </Suspense>
//       </div>
//     </div>
//   );
// }

import { type Metadata } from "next";
import { draftMode } from "next/headers";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import FilteredListings from "@/components/FilteredListings";
import { Listing } from "@/types";

interface QueryParams {
  query?: string;
}

export default async function FilteredListingsPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = (await searchParams).query || "";

  // Sanity query using GROQ
  const listingsQuery = groq`
  *[_type == "listing" && (
    title match $query + "*" ||
    description match $query + "*" ||
    tags[]->name match $query + "*"
  )] {
    _id,
    _createdAt,
    title,
    description,
    slug,
    image,
    category,
    condition,
    price,
    contact,
    toolDetails,
    author,
    "slug": slug.current,
  }
`;

  const params: QueryParams = (await searchParams).query
    ? { query: (await searchParams).query }
    : { query: undefined };
  const listings = await client
    .withConfig({ useCdn: false })
    .fetch<
      Listing[]
    >(listingsQuery, params as import("@sanity/client").QueryParams);

  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
      <div className="w-full mt-10 px-6">
        <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
          <h1 className="text-slate-600 text-3xl font-semibold">
            Search Results for "{query}"
          </h1>
        </header>
        <div className="grid grid-cols-3 gap-4 text-xl items-center py-6">
          {listings.length > 0 &&
            listings.map((listing) => (
              <FilteredListings
                key={listing._id}
                listings={[listing]}
                query={query}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
