"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function updateFeaturedStatus(
  email: string,
  isFeatured: boolean,
  subscriptionData?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  },
) {
  try {
    // Find the author by email
    const author = await client.fetch(
      `*[_type == "author" && email == $email][0]`,
      { email },
    );

    if (!author) {
      return { success: false, error: "Author not found" };
    }

    // Update featured status
    const updateData: any = {
      isFeatured,
    };

    if (isFeatured) {
      updateData.featuredSince = new Date().toISOString();
      // Set featured until 1 month from now
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      updateData.featuredUntil = futureDate.toISOString();

      if (subscriptionData?.stripeCustomerId) {
        updateData.stripeCustomerId = subscriptionData.stripeCustomerId;
      }
      if (subscriptionData?.stripeSubscriptionId) {
        updateData.stripeSubscriptionId = subscriptionData.stripeSubscriptionId;
      }
    } else {
      // When canceling, clear subscription data
      updateData.featuredUntil = new Date().toISOString();
      updateData.stripeCustomerId = null;
      updateData.stripeSubscriptionId = null;
    }

    await writeClient.patch(author._id).set(updateData).commit();

    revalidatePath("/user-profile", "page");
    revalidatePath("/all-listings", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating featured status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

export async function getFeaturedStatus(email: string) {
  try {
    const author = await client.fetch(
      `*[_type == "author" && email == $email][0]{
        isFeatured,
        featuredSince,
        featuredUntil,
        stripeCustomerId,
        stripeSubscriptionId
      }`,
      { email },
    );

    if (!author) {
      return { success: false, error: "Author not found" };
    }

    // Check if featured status has expired
    if (author.isFeatured && author.featuredUntil) {
      const expiryDate = new Date(author.featuredUntil);
      const now = new Date();

      if (now > expiryDate) {
        // Auto-expire the featured status
        await updateFeaturedStatus(email, false);
        return {
          success: true,
          data: {
            isFeatured: false,
            featuredSince: null,
            featuredUntil: null,
          },
        };
      }
    }

    return {
      success: true,
      data: {
        isFeatured: author.isFeatured || false,
        featuredSince: author.featuredSince,
        featuredUntil: author.featuredUntil,
        stripeCustomerId: author.stripeCustomerId,
        stripeSubscriptionId: author.stripeSubscriptionId,
      },
    };
  } catch (error) {
    console.error("Error getting featured status:", error);
    return { success: false, error: "Failed to get status" };
  }
}
