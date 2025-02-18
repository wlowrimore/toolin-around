"use server";

import { auth } from "@/auth";
import { extractPublicIdFromUrl, parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "./cloudinary";

interface Author {
  _id: string;
  _type: string;
  email: string;
  name?: string;
  image: string;
}

export type Listing = {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  toolDetails: string;
  contact: string;
  author: Author;
};

export type ListingWithAuthorRef = Omit<Listing, "author"> & {
  author: {
    _ref: string;
    email: string;
  };
};

// New interface for listing with expanded author
interface ListingWithAuthor extends Omit<ListingWithAuthorRef, "author"> {
  author: Author;
  deleteToken: string;
  price: string;
  ratePeriod: string;
}

export type ListingFormData = {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  ratePeriod: string;
  image: string;
  imageDeleteToken?: string;
  toolDetails: string;
  contact: string;
};

export const createToolDetails = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const {
    title,
    description,
    category,
    condition,
    image,
    toolDetails,
    price,
    ratePeriod,
    deleteToken,
    contact,
  } = Object.fromEntries(form);

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const existingAuthor = await writeClient.fetch(
      `*[_type == "author" && email == $email][0]._id`,
      { email: session.user?.email }
    );

    let authorId;

    if (!existingAuthor) {
      // Create new author if doesn't exist
      const newAuthor = await writeClient.create({
        _type: "author",
        name: session.user?.name || "Unknown Author",
        email: session.user?.email,
        image: session.user?.image || "",
        id: session.user?.email,
      });
      authorId = newAuthor._id;
    } else {
      authorId = existingAuthor;
    }

    const listing = {
      _type: "listing",
      title,
      description,
      category,
      condition,
      image: image as string,
      deleteToken: deleteToken as string,
      contact: contact as string,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
      toolDetails: toolDetails as string,
      price: price as string,
      ratePeriod: ratePeriod as string,
    };

    const result = await writeClient.create(listing);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Creation error:", error);

    return parseServerActionResponse({
      error:
        error instanceof Error ? error.message : "Failed to create listing",
      status: "ERROR",
    });
  }
};

// ----------------------------------------------------------------
//                          MUTATIONS
// ----------------------------------------------------------------

export async function updateListing(
  listingId: string,
  data: Partial<
    Omit<ListingWithAuthorRef, "author"> & {
      contact: string;
      category: string;
      toolDetails: string;
      image: string;
      condition: string;
      description: string;
      title: string;
      imageDeleteToken?: string;
      deleteToken: string;
      price: string;
      ratePeriod: string;
    }
  >,
  authorEmail: string
) {
  try {
    // Get the existing listing first
    const existingListing = await client.fetch<ListingWithAuthor | null>(
      `*[_type == "listing" && _id == $listingId][0]{
        _id,
        _type,
        title,
        description,
        category,
        condition,
        image,
        deleteToken,
        toolDetails,
        price,
        ratePeriod,
        contact,
        "author": author->{
          _id,
          _type,
          email,
          name,
        }
      }`,
      { listingId }
    );

    if (!existingListing) {
      throw new Error(`Service with ID ${listingId} not found`);
    }

    // Check if the service's author email matches the provided email
    if (existingListing.author.email !== authorEmail) {
      throw new Error(
        "Unauthorized: You don't have permission to edit this listing"
      );
    }

    let updatedImageUrl = existingListing.image;
    if (data.image && data.image !== existingListing.image) {
      if (existingListing.image) {
        try {
          const publicId = extractPublicIdFromUrl(existingListing.image);
          if (publicId) {
            await deleteCloudinaryImage(publicId);
            console.log("Old image deleted from Cloudinary");
          }
        } catch (deleteError) {
          console.error(
            "Error deleting old image from Cloudinary:",
            deleteError
          );
        }
      }

      updatedImageUrl = data.image;
    }

    // Use the existing author reference for the update
    const updatedData: Partial<ListingWithAuthorRef> & { deleteToken: string } =
      {
        title: data.title,
        description: data.description ?? existingListing.description,
        category: data.category ?? existingListing.category,
        image: updatedImageUrl,
        deleteToken: data.deleteToken ?? existingListing.deleteToken,
        toolDetails: data.toolDetails ?? existingListing.toolDetails,
        condition: data.condition ?? existingListing.condition,
        contact: data.contact ?? existingListing.contact,
        price: data.price ?? existingListing.price,
        ratePeriod: data.ratePeriod ?? existingListing.ratePeriod,
      } as Partial<ListingWithAuthorRef> &
        ListingFormData & { deleteToken: string };
    console.log("DELETE TOKEN: ", updatedData.deleteToken);
    const result = await writeClient.patch(listingId).set(updatedData).commit();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function createDeleteAction() {
  const token = process.env.SANITY_STUDIO_API_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_TOKEN environment variable not set");
  }

  // Return an authenticated client with the token
  return client.withConfig({
    token: token,
    useCdn: false,
  });
}

export async function deleteListing(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Authorization required");
    }

    // Get an authenticated client
    const authenticatedClient = await createDeleteAction();

    // Fetch the listing first to check permissions
    const listing = await authenticatedClient.fetch(
      `*[_type == "listing" && _id == $listingId][0]{
        _id,
        image,
        title,
        deleteToken,
        author->{
          _id,
          email
        }
      }`,
      { listingId }
    );

    console.log("Listing to delete: ", listing);

    if (!listing) {
      throw new Error("Listing not found");
    }

    if (!listing.author) {
      throw new Error("Listing author information not found");
    }

    if (listing.author.email !== session.user.email) {
      throw new Error(
        "Unauthorized: You don't have permission to delete this listing"
      );
    }

    console.log("Listing.Author.Email: ", listing.author.email);
    console.log("Session.User.Email: ", session.user.email);

    // Use a transaction to delete ratings and the listing
    const transaction = authenticatedClient.transaction();

    // Get rating IDs
    const ratingIds = await authenticatedClient.fetch(
      `*[_type == "rating" && listing._ref == $listingId]._id`,
      { listingId }
    );

    // Add each rating deletion to the transaction
    for (const ratingId of ratingIds) {
      transaction.delete(ratingId);
    }

    // Add listing deletion to the transaction
    transaction.delete(listingId);

    // Execute the transaction
    await transaction.commit();

    // Delete the image from Cloudinary if deleteToken exists
    if (listing.deleteToken) {
      try {
        await deleteCloudinaryImage(listing.deleteToken);
        console.log("Cloudinary image deleted successfully");
      } catch (cloudinaryError) {
        console.error("Failed to delete Cloudinary image:", cloudinaryError);
      }
    }

    revalidatePath("/");

    return {
      status: "SUCCESS",
      message: "Listing deleted successfully",
    };
  } catch (error) {
    console.error("Error during deletion:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
