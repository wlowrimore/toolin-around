"use server";

import { auth } from "@/auth";
import { extractPublicIdFromUrl, parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
// import { deleteCloudinaryImage } from "@/lib/cloudinary";

interface Author {
  _id: string;
  _type: string;
  email: string;
  name?: string;
  image: string;
}

export type Service = {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  image: string;
  license: string;
  licensingState: string;
  category: string;
  pitch: string;
  contact: string;
  author: Author;
};

export type ServiceWithAuthorRef = Omit<Service, "author"> & {
  author: {
    _ref: string;
    email: string;
  };
};

// New interface for service with expanded author
interface ServiceWithAuthor extends Omit<ServiceWithAuthorRef, "author"> {
  author: Author;
  deleteToken: string;
}

export type ServiceFormData = {
  title: string;
  description: string;
  category: string;
  image: string;
  license: string;
  licensingState: string;
  imageDeleteToken?: string;
  pitch: string;
  contact: string;
};

export const createPitch = async (state: any, form: FormData) => {
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
    image,
    license,
    licensingState,
    pitch,
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

    const service = {
      _type: "service",
      title,
      description,
      category,
      image: image as string,
      license: license as string,
      licensingState: licensingState as string,
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
      pitch,
    };

    const result = await writeClient.create(service);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Creation error:", error);

    return parseServerActionResponse({
      error:
        error instanceof Error ? error.message : "Failed to create service",
      status: "ERROR",
    });
  }
};
