// import { auth } from "@/auth";
// import { LISTINGS_QUERY } from "@/sanity/lib/queries";
// import { sanityFetch } from "@/sanity/lib/live";
// import { Suspense } from "react";
// import { LoadingBar } from "@/components/LoadingAnimations";
// import ListerProfileListingCard from "@/components/ListerProfileListingCard";

// export default async function ListerProfilePage({
//   searchParams,
// }: {
//   searchParams: Promise<{ query?: string; category?: string; id: string }>;
// }) {
//   const query = (await searchParams).query || null;
//   const listingId = (await searchParams).id || null;
//   const params = {
//     search: query || null,
//     id: listingId || null,
//     category: null,
//   };

//   const session = await auth();

//   const { data: listings } = await sanityFetch({
//     query: LISTINGS_QUERY,
//     params,
//   });
//   console.log("LISTINGS:", listings);

//   const listersListings = listings?.filter(
//     (listing: any) => listing.author._ref !== session?.user.id
//   );

//   console.log("LISTERS LISTINGS:", listersListings);

//   return (
//     <Suspense fallback={<LoadingBar />}>
//       <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6">
//         <header className="flex items-center w-full border-b-[0.025rem] border-slate-300 py-2">
//           <h1 className="text-slate-600 text-3xl font-semibold">
//             Listers Listings
//           </h1>
//         </header>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
//           {listersListings && listersListings.length > 0 && (
//             <ListerProfileListingCard
//               listings={listersListings}
//               listingId={listingId}
//             />
//           )}
//         </div>
//       </main>
//     </Suspense>
//   );
// }

// import { auth } from "@/auth";
// import { LISTINGS_QUERY } from "@/sanity/lib/queries";
// import { sanityFetch } from "@/sanity/lib/live";
// import { Suspense } from "react";
// import { LoadingBar } from "@/components/LoadingAnimations";
// import ListerProfileListingCard from "@/components/ListerProfileListingCard";

// export default async function ListerProfilePage({
//   searchParams,
// }: {
//   searchParams: Promise<{ query?: string; category?: string; id: string }>;
// }) {
//   const query = (await searchParams).query || null;
//   const listingId = (await searchParams).id || null;
//   const params = {
//     search: query || null,
//     id: listingId || null,
//     category: null,
//   };

//   const session = await auth();

//   const { data: listings } = await sanityFetch({
//     query: LISTINGS_QUERY,
//     params,
//   });
//   console.log("LISTINGS:", listings);

//   return (
//     <Suspense fallback={<LoadingBar />}>
//       <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6">
//         <header className="flex items-center w-full border-b-[0.025rem] border-slate-300 py-2">
//           <h1 className="text-slate-600 text-3xl font-semibold">
//             Listers Listings
//           </h1>
//         </header>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
//           {listings && listings.length > 0 ? (
//             <ListerProfileListingCard
//               listings={listings}
//               listingId={listingId}
//             />
//           ) : (
//             <div className="col-span-4 text-center py-10">
//               <p className="text-slate-400">No listings found</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </Suspense>
//   );
// }

import { auth } from "@/auth";
import { createListingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Suspense } from "react";
import { LoadingBar } from "@/components/LoadingAnimations";
import ListerProfileListingCard from "@/components/ListerProfileListingCard";

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

  console.log("AUTHOR ID:", authorId);
  console.log("LISTINGS:", listings);

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
