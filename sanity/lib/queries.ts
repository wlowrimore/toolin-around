import { defineQuery } from "next-sanity";

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
