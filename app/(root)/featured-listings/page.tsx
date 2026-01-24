import { client } from "@/sanity/lib/client";
import FeaturedListings from "../components/FeaturedListings";
import { Listing } from "@/types";

export default async function FeaturedListingsPage() {
  // Fetch listings where author is featured
  const featuredListings = await client.fetch<Listing[]>(`
  *[_type == "listing" && isFeaturedListing == true && author->isFeatured == true] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    toolDetails,
    category,
    condition,
    image,
    price,
    ratePeriod,
    contact,
    slug,
    isFeaturedListing,
    author-> {
      _id,
      name,
      image,
      email,
      isFeatured
    }
  }
`);

  console.log("Featured listings found:", featuredListings.length);
  console.log("Listings:", featuredListings);

  return (
    <main className="max-w-7xl mx-auto flex flex-col my-10">
      <FeaturedListings listings={featuredListings} />
    </main>
  );
}
