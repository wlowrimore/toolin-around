import { defineQuery } from "next-sanity";
import { createClient } from "@sanity/client";

export const LISTINGS_QUERY = defineQuery(`
  *[_type == "listing" && defined(slug.current) && 
    (
      !defined($search) || 
      title match $search || 
      category match $search || 
      author->name match $search
    ) && 
    (
      !defined($category) || 
      category match $category
    )
  ] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id,
      name,
      image,
      email
    },
    description,
    category,
    image,
    condition,
    price,
    contact,
    toolDetails,
    "ratings": *[_type == "rating" && service._ref == ^._id] {
      _id,
      rating,
      review,
      createdAt,
      user-> {
        _id,
        name,
        image
      }
    }
  }`);

export const AUTHOR_BY_GOOGLE_ID_QUERY =
  defineQuery(`[_type == "author" && email == $email][0]{
      _id,
      id,
      name,
      email,
      image,
      "roles": roles[]->{
      code
      }
    }`);
