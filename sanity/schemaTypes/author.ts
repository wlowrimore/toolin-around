import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      hidden: true,
      description: "Author ID (email)",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().unique(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
    }),
    defineField({
      name: "roles",
      title: "Roles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "role" }] }],
    }),
    defineField({
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featuredSince",
      title: "Featured Since",
      type: "datetime",
      description: "Date when user became featured",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      description: "Stripe customer ID for subscription management",
    }),
    defineField({
      name: "stripeSubscriptionId",
      title: "Stripe Subscription ID",
      type: "string",
      description: "Active Stripe subscription ID",
    }),
    defineField({
      name: "listingRatings",
      title: "Listing Ratings",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "listing",
              title: "Listing",
              type: "reference",
              to: [{ type: "listing" }],
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: "averageRating",
              title: "Average Rating",
              type: "number",
              validation: (Rule: any) => Rule.precision(2).min(0).max(5),
              initialValue: 0,
            }),
            defineField({
              name: "totalRatings",
              title: "Total Ratings",
              type: "number",
              initialValue: 0,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      email: "email",
    },
    prepare({ title, email }) {
      return {
        title,
        subtitle: email,
      };
    },
  },
});
