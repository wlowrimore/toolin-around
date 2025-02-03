import React from "react";
import ListingCard from "../ListingCard";

const Feature = () => {
  return (
    <div className="w-full mt-10 px-6">
      <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
        <h1 className="text-slate-600 text-3xl font-semibold">
          Featured Listings
        </h1>
        <h2 className="text-xl text-slate-600">
          Here are your top 3 rated listings for the week of 01/03/2025
        </h2>
      </header>
      <div className="grid grid-cols-3 gap-4 text-xl font-bold items-center py-6">
        <ListingCard />
      </div>
    </div>
  );
};

export default Feature;
