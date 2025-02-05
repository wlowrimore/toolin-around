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
    _type,
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
    deleteToken,
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

export const PLAYLIST_BY_SLUG_QUERY = defineQuery(`
      *[_type == "playlist" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        description,
        category,
        image,
        toolDescription,
        "ratings": *[_type == "rating" && listing._ref == ^._id] {
          _id,
          rating,
          review,
          createdAt,
          user-> {
            _id,
            name,
            image
          }
        },
        "select": select[]->{
          _id,
          _createdAt,
          title,
          slug,
          description,
          category,
          image,
          "ratings": *[_type == "rating" && listing._ref == ^._id] {
          _id,
          rating,
          review,
          createdAt,
          user-> {
            _id,
            name,
            image
          }
        },
          author-> {
            _id,
            name,
            slug,
            image,
            email
          }
        }
      }`);

export const LISTING_BY_ID_QUERY =
  defineQuery(`*[_type == "listing" && _id == $id][0]{
      _id,
      title,
      slug,
      _createdAt,
      author->{
        _id,
        name,
        image,
        email
      },
      description,
      category,
      image,
      toolDetails,
      contact
    }`);
