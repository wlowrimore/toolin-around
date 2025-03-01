import { defineType } from "sanity";

export const conversation = defineType({
  name: "conversation",
  title: "Conversation",
  type: "document",
  fields: [
    {
      name: "subject",
      title: "Subject",
      type: "string",
      description: "Subject line for the conversation",
    },
    {
      name: "participants",
      title: "Participants",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "author" }],
        },
      ],
      validation: (Rule: any) => Rule.required().min(2),
    },
    {
      name: "listing",
      title: "Listing",
      type: "reference",
      to: [{ type: "listing" }],
    },
    {
      name: "lastMessageAt",
      title: "Last Message At",
      type: "datetime",
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
      subject: "subject",
      participants: "participants",
      lastMessageAt: "lastMessageAt",
    },
    prepare(selection: any) {
      const { subject, participants, lastMessageAt } = selection;
      return {
        title: subject || "No Subject",
        subtitle: `Last activity: ${lastMessageAt ? new Date(lastMessageAt).toLocaleString() : "Unknown"}`,
      };
    },
  },
  orderings: [
    {
      title: "Last Message",
      name: "lastMessageDesc",
      by: [{ field: "lastMessageAt", direction: "desc" }],
    },
  ],
});
