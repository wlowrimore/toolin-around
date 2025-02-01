import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "./sanity/lib/queries";

import { groq } from "next-sanity";

console.log("AUTH_URL:", process.env.AUTH_URL);
console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
console.log("AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID);
console.log("AUTH_GOOGLE_SECRET:", process.env.AUTH_GOOGLE_SECRET);
console.log("AUTH_SECRET:", process.env.AUTH_SECRET);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      roles: string[];
    };
  }

  interface Token {
    id: string;
    roles: string[];
  }
}

export const createValidId = (email: string) => {
  return `author-${email.replace(/[@.]/g, "-")}`;
};

const authorQuery = groq`*[_type == "author" && email == $email][0]{
  _id,
  name,
  email,
  image,
  roles[]->{
    _id,
    code,
    name
  }
}`;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  debug: false,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) {
        console.error("No email provided by Google");
        return false;
      }

      if (account?.provider === "google") {
        try {
          const existingAuthor = await client
            .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
              email: user.email,
            })
            .catch((err) => {
              console.error("Error fetching author:", err);
              return null;
            });

          if (!existingAuthor) {
            const validId = createValidId(user.email);
            try {
              const adminRole = await client.fetch(
                `*[_type == "role" && code == "administrator"][0]._id`
              );

              if (!adminRole) {
                const roleDoc = await writeClient.create({
                  _type: "role",
                  _id: "role-administrator",
                  name: "Administrator",
                  code: "administrator",
                });
                console.log("Created administrator role:", roleDoc);
              }

              await writeClient.createIfNotExists({
                _type: "author",
                _id: validId, // Using email as ID
                name: user.name,
                email: user.email,
                image: user.image,
                roles: [
                  {
                    _type: "reference",
                    _ref: adminRole || "role-administrator",
                  },
                ],
              });
              console.log("New author created successfully");
            } catch (createError) {
              console.error("Error creating author:", createError);
            }
          }

          return true;
        } catch (error) {
          console.error("Error in signin callback:", error);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      try {
        if (user?.email) {
          const author = await client
            .fetch<{
              _id: string;
              name: string;
              email: string;
              image: string;
              roles: Array<{ _id: string; code: string; name: string }>;
            } | null>(authorQuery, {
              email: user.email,
            })
            .catch(() => null);

          console.log("Author data:", JSON.stringify(author, null, 2));

          if (author) {
            token.id = author._id;
            token.roles = author.roles?.map(
              (role: { code: string }) => role.code
            ) || ["administrator"];
          } else {
            token.id = createValidId(user.email);
            token.roles = ["administrator"];
          }
        }
      } catch (error) {
        console.error("Error in JWT callback:", error);
        token.roles = token.roles || ["administrator"];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) || ["administrator"];
      }
      return session;
    },
  },
});
