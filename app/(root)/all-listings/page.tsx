import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { auth } from "@/auth";
import { ListingType } from "@/types";
import { LISTINGS_QUERY } from "@/sanity/lib/queries";
import { Geist, Hurricane } from "next/font/google";
import { SearchModal } from "@/app/(root)/components/SearchModal";
import ListingCard from "@/app/(root)/components/ListingCard";
import PageHeaderSearchForm from "@/app/(root)/components/PageHeaderSearchForm";
import { LoadingBar } from "@/app/(root)/components/LoadingAnimations";

const hurricane = Hurricane({
  variable: "--font-hurricane",
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

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

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center mx-auto">
          <LoadingBar />
        </div>
      }
    >
      <main className="max-w-[77rem] rounded-t-xl mx-auto flex flex-col items-center w-full my-10">
        <header className="flex items-center w-full border-b-[0.025rem] border-slate-300 py-2">
          <h1
            className={`${geist.className} text-black/80 text-3xl font-semibold`}
          >
            All Listings
          </h1>
        </header>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 bg-slate-300 p-6 border-2 border-slate-700/10 rounded-xl">
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
              ratePeriod={listing.ratePeriod}
            />
          ))}
        </div>
      </main>
    </Suspense>
  );
}
