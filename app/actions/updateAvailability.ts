"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { author } from "@/sanity/schemaTypes/author";
import { revalidatePath } from "next/cache";

export async function updateAvailability(
  listingId: string,
  availability: boolean
) {
  console.log("=== UPDATE AVAILABILITY CALLED ===");
  console.log("Listing ID:", listingId);
  console.log("New Availability:", availability);

  try {
    const result = await writeClient
      .patch(listingId)
      .set({ availability: availability })
      .commit();

    console.log("Sanity update result:", result);

    // revalidatePath(`/user-profile/", "page"`);
    revalidatePath(`/user-profile/${result.author._ref}`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating availability:", error);
    return { success: false, error: "Failed to update availability" };
  }
}
