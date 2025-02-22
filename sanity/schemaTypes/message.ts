import { defineField, defineType } from "sanity";

export const message = defineType({
  name: "message",
  title: "Message",
  type: "document",
  fields: [
    {
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "sender",
      title: "Sender",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recipient",
      title: "Recipient",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "listing",
      title: "Listing",
      type: "reference",
      to: [{ type: "listing" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "isRead",
      title: "Is Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      sender: "serder.name",
      recipient: "recipient.name",
      content: "content",
      createdAt: "createdAt",
    },
    prepare(selection: any) {
      const { sender, recipient, content, createdAt } = selection;
      return {
        title: content,
        subtitle: `From ${sender || "Unknown"} To ${recipient || "Unknown"} On ${createdAt}`,
      };
    },
  },
  orderings: [
    {
      title: "Created At",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
