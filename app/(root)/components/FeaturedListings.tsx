"use client";

import { useState } from "react";
import { useFeatured } from "@/contexts/FeaturedContext";
import FeatureModal from "./feature-signup/FeatureModal";
import { Gem } from "lucide-react";
import { Geist } from "next/font/google";
import { LoadingSpinnerRed } from "./LoadingAnimations";
import ListerProfileListingCard from "./ListerProfileListingCard";
import { Listing } from "@/types";

const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

const FeaturedListings = ({ listings }: { listings: Listing[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isLoading } = useFeatured();

  if (isLoading) {
    return (
      <div className="max-w-[50%] flex flex-col py-2 px-4 bg-black">
        <p className="">
          <LoadingSpinnerRed />
        </p>
      </div>
    );
  }

  return (
    <main className="p-6 flex flex-col gap-4 w-full max-w-7xl mx-auto">
      <header className="flex items-center w-full border-b-[0.025rem] border-slate-300 py-2">
        <Gem className="size-8 text-sky-500/80 mr-2" />
        <h1
          className={`${geist.className} text-black/80 text-3xl font-semibold`}
        >
          Featured Listings
        </h1>
      </header>
      <h2 className="text-sm text-slate-600">
        These listings are provided by our featured listers. If you would like
        to become a featured lister, please{" "}
        <button
          type="button"
          onClick={(e) => setIsOpen(true)}
          className="text-red-600 hover:underline"
        >
          click here.
        </button>
      </h2>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {listings.map((listing) => (
            <ListerProfileListingCard key={listing._id} listings={[listing]} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Gem className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Featured Listings Yet
          </h3>
          <p className="text-gray-500">
            Be the first to become a featured lister!
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-4 bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Become a Featured Lister
          </button>
        </div>
      )}
      {isOpen && (
        <FeatureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </main>
  );
};

export default FeaturedListings;
