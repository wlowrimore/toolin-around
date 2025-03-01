import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { category } from "./category";
import { condition } from "./condition";
import { listing } from "./listing";
import { playlist } from "./playlist";
import { rating } from "./rating";
import { ratingKey } from "./ratingKey";
import { role } from "./role";
import { user } from "./user";
import { message } from "./message";
import { conversation } from "./conversation";

export const schema = {
  types: [
    author,
    category,
    condition,
    listing,
    playlist,
    rating,
    ratingKey,
    role,
    user,
    message,
    conversation,
  ] as SchemaTypeDefinition[],
};
