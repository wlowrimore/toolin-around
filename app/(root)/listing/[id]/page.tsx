import React from "react";
import ListingDetailsCard from "@/components/ListingDetailsCard";
import { ListingCardProps, Slug } from "@/types";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  LISTING_BY_ID_QUERY,
  PLAYLIST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { auth } from "@/auth";

interface IndividualListingPageProps extends ListingCardProps {
  params: {
    id: string;
    description: string;
  };
}

interface Listing {
  _id: string;
  title: string;
  slug: Slug;
  _createdAt: string;
  description: string;
  price: number | null;
  ratePeriod: string | null;
  image: string;
  category: string;
  condition: string | null;
  contact: string | null;

  author: {
    _id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  toolDetails: string | null;
}

const IndividualListingPage = async ({
  params,
}: IndividualListingPageProps) => {
  params = (await params) as { id: string; description: string };

  console.log("PARAMS IN ID PAGE:", params);
  if (!params.id) {
    return notFound();
  }

  const session = await auth();

  if (!session) {
    return (
      <div className="w-full p-4 h-[96vh] flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          You must be logged in to view this page.
        </h1>
      </div>
    );
  }

  const listingResult = await client.fetch(
    `*[_type == "listing" && _id == $id]{
      _id,
      title,
      slug,
      _createdAt,
      description,
      price,
      ratePeriod,
      image,
      category,
      condition,
      contact,
      author->{
        _id,
        name,
        image,
        email
      },
      toolDetails
    }[0]`,
    { id: params.id }
  );
  console.log("PARAMS.ID AFTER FETCH:", params.id);
  if (!listingResult) {
    return notFound();
  }

  const slug = {
    current: listingResult.slug.current,
    _type: "slug" as const,
  } as const;

  const listing = {
    ...listingResult,
    _type: "listing" as const,
    createdAt: listingResult._createdAt,
    slug,
    description: listingResult.description,
    condition: listingResult.condition,
    deleteToken: null,
    price: listingResult.price,
    ratePeriod: listingResult.ratePeriod,
    contact: listingResult.contact,
  };

  console.log("LISTING IN ID PAGE:", listing);

  return (
    <main className="max-w-4xl h-[90vh] mx-auto flex flex-col justify-center items-center font-[family-name:var(--font-poppins)]">
      <ListingDetailsCard
        listing={listing}
        createdAt={listing?._createdAt}
        id={listing?._id}
        title={listing?.title}
        description={listing?.description}
        price={listing?.price}
        ratePeriod={listing?.ratePeriod}
        image={listing?.image}
        category={listing?.category}
        condition={listing?.condition}
        contact={listing?.contact}
        author={listing?.author}
        toolDetails={listing?.toolDetails}
      />
    </main>
  );
};

export default IndividualListingPage;
