import { defineType, defineField } from "sanity";

export const role = defineType({
  name: "role",
  title: "Role",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
