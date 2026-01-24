"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

export async function setFeaturedListing(
  listingId: string,
  authorEmail: string,
  isFeatured: boolean,
) {
  try {
    // Get the author
    const author = await client.fetch(
      `*[_type == "author" && email == $email][0]{ _id }`,
      { email: authorEmail },
    );

    if (!author) {
      return { success: false, error: "Author not found" };
    }

    if (isFeatured) {
      // First, unfeatured all other listings by this author
      const otherListings = await client.fetch(
        `*[_type == "listing" && author._ref == $authorId && _id != $listingId && isFeaturedListing == true]`,
        { authorId: author._id, listingId },
      );

      console.log(`Unfeaturing ${otherListings.length} other listings`);

      // Unfeature all other listings
      for (const listing of otherListings) {
        await writeClient
          .patch(listing._id)
          .set({ isFeaturedListing: false })
          .commit();
      }
    }

    // Now set the current listing's featured status
    await writeClient
      .patch(listingId)
      .set({ isFeaturedListing: isFeatured })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error setting featured listing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update",
    };
  }
}
