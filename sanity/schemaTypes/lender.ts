import { defineField, defineType } from "sanity";

export const lender = defineType({
  name: "lender",
  title: "Lender",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
