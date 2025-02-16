import { LISTING_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import ListToolsForm from "@/components/Forms/ListToolsForm";
import { Suspense } from "react";

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  params = (await params) || {};
  const listingId = params.id;

  console.log("PARAMS IN EDIT PAGE:", listingId);

  const LISTING_BY_ID_QUERY = `
    *[_type == "listing" && _id == $id] {
      _id,
      title,
      description,
      image,
      category,
      condition,
      price,
      ratePeriod,
      "author": author->,
      slug,
      _createdAt,
      ratings,
      deleteToken,
      toolDetails,
      contact
    }
  `;

  const response = await client.fetch(LISTING_BY_ID_QUERY, {
    id: listingId,
  });
  const listing = response[0];
  console.log("LISTING IN EDIT PAGE:", listing);

  if (!listing) {
    return (
      <div className="w-full p-4 h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Sorry, this listing was either deleted or doesn&apos;t exist.
        </h1>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
        <ListToolsForm
          initialData={listing}
          authorEmail={listing.author._ref}
        />
      </main>
    </Suspense>
  );
}
