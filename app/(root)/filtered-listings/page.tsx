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
    : { query: "" };
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
