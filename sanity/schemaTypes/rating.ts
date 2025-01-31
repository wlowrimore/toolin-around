import { defineField, defineType } from "sanity";

export const rating = defineType({
  name: "rating",
  title: "Rating",
  type: "document",
  fields: [
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "review",
      title: "Review",
      type: "text",
    }),
    defineField({
      name: "listing",
      title: "Listing",
      type: "reference",
      to: [{ type: "listing" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "listing" }], // Make sure this matches your user schema type
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
