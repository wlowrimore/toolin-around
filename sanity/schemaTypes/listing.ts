import { defineField, defineType } from "sanity";

export const listing = defineType({
  name: "listing",
  title: "Listing",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      description: "The author who created this service",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.min(10).max(100),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deleteToken",
      title: "Delete Token",
      type: "string",
    }),
    defineField({
      name: "toolDetails",
      title: "Tool Details",
      type: "text",
      description: "Briefly describe your listing",
      validation: (Rule) => Rule.required().min(20).max(1000),
    }),
    defineField({
      name: "contact",
      title: "Contact Email",
      type: "email",
      description: "Contact email for this service",
      validation: (Rule) => Rule.required().error("Contact email is required"),
    }),
  ],
});
