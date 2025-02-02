// import { defineConfig, DocumentActionComponent } from "sanity";
// import { visionTool } from "@sanity/vision";
// import { structureTool } from "sanity/structure";
// import { schema } from "./sanity/schemaTypes";
// import { structure } from "./sanity/structure";
// import { validateToken } from "./middleware/sanityStudio";
// import type { SanityDocument } from "@sanity/types";
// import type { User } from "next-auth";

// // Create a separate env.ts file to handle environment variables
// const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
// const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// interface AuthProvider {
//   name: string;
//   title: string;
//   url: string;
//   options?: {
//     token: string;
//     apiVersion: string;
//   };
// }

// interface AccessControlContext {
//   document: SanityDocument;
//   identity: User | null;
// }

// if (!projectId) {
//   throw new Error(
//     "Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
//   );
// }

// export default defineConfig({
//   basePath: "/studio",
//   projectId,
//   dataset,
//   apiVersion,
//   schema,
//   plugins: [
//     structureTool({ structure }),
//     visionTool({ defaultApiVersion: apiVersion }),
//   ],
//   auth: {
//     type: "custom",
//     login: {
//       name: "custom",
//       title: "Login with Google",
//       component: async () => {
//         window.location.href = "/api/auth/signin";
//       },
//     },
//     redirectOnSingle: false,
//     providers: <AuthProvider[]>[
//       // Fixed typo from 'profiders'
//       {
//         name: "jwt",
//         title: "Login with Google",
//         url: "/api/sanity/token",
//         options: {
//           token: process.env.SANITY_STUDIO_API_TOKEN as string,
//           apiVersion,
//         },
//       },
//     ],

//     middleware: async (req: any, res: any, next: any) => {
//       const authHeader = req.headers.authorization;
//       if (!authHeader?.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       const token = authHeader.split(" ")[1];
//       const { valid, payload } = await validateToken(token);

//       if (!valid) {
//         return res.status(401).json({ message: "Invalid token" });
//       }

//       // Add user info to the request
//       req.user = {
//         id: payload?.sub as string,
//         email: payload?.email as string,
//         roles: payload?.roles as string[],
//       };

//       return next();
//     },
//   },

//   accessControl: {
//     rules: [
//       {
//         operation: "read",
//         allow: true,
//       },
//       {
//         operation: "create",
//         allow: ({ identity }: AccessControlContext) => {
//           console.log("Create Permission Check:", {
//             identity: identity?.email,
//             hasIdentity: !!identity,
//           });
//           return !!identity;
//         },
//         permission: "create",
//       },
//       {
//         operation: "update",
//         allow: ({ document, identity }: AccessControlContext) => {
//           return (
//             (document?.author as { _ref: string })?._ref ===
//             `author-${identity?.email}`
//           );
//         },
//         permission: "update",
//       },
//       {
//         operation: "delete",
//         allow: ({ document, identity }: AccessControlContext) => {
//           return (
//             (document?.author as { _ref: string })?._ref ===
//             `author-${identity?.email}`
//           );
//         },
//         permission: "delete",
//       },
//     ],
//   },
//   document: {
//     // New: Add permissions
//     actions: (
//       prev: DocumentActionComponent[],
//       { schemaType }: { schemaType: string }
//     ) => {
//       if (schemaType === "listing") {
//         return prev.filter(
//           ({ action }: DocumentActionComponent) =>
//             action !== undefined &&
//             ["create", "update", "delete", "publish"].includes(action)
//         );
//       }
//       return prev;
//     },
//   },

//   newDocumentOptions: {
//     publishOnCreate: true,
//   },

//   cors: {
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   },
// });

"use client";
import { LoginMethod } from "sanity";
import { defineConfig } from "sanity";
import { validateToken } from "./middleware/sanityStudio";
import type { SanityDocument, User } from "@sanity/types";

import { visionTool } from "@sanity/vision";
// import { sanityConfig } from "./lib/utils";
import { structureTool } from "sanity/structure";

// import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

interface AccessControlContext {
  document: SanityDocument;
  identity: User | null;
}

const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "2024-01-01";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  // dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  auth: {
    type: "custom",
    // loginMethod: "jwt" as LoginMethod,
    login: {
      name: "custom",
      title: "Login with Google",
      component: async () => {
        window.location.href = "/api/auth/signin";
      },
    },
    redirectOnSingle: false,
    providers: [
      {
        name: "jwt",
        title: "Login with Google",
        url: "/api/sanity/token",
      },
    ],
    middleware: async (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const { valid, payload } = await validateToken(token);

      if (!valid) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Add user info to the request
      req.user = {
        id: payload?.sub as string,
        email: payload?.email as string,
        roles: payload?.roles as string[],
      };

      return next();
    },
  },
  accessControl: {
    rules: [
      {
        operation: "read",
        allow: true,
      },
      {
        operation: "create",
        allow: ({ identity }: AccessControlContext) => {
          console.log("Create Permission Check:", {
            identity: identity?.email,
            hasIdentity: !!identity,
          });
          return !!identity;
        },
        permission: "create",
      },
      {
        operation: "update",
        allow: ({ document, identity }: AccessControlContext) => {
          return (
            (document?.author as { _ref: string })?._ref ===
            `author-${identity?.email}`
          );
        },
        permission: "update",
      },
      {
        operation: "delete",
        allow: ({ document, identity }: AccessControlContext) => {
          return (
            (document?.author as { _ref: string })?._ref ===
            `author-${identity?.email}`
          );
        },
        permission: "delete",
      },
    ],
  },
  document: {
    // New: Add permissions
    actions: (prev, { schemaType }) => {
      if (schemaType === "service") {
        return prev.filter(
          ({ action }) =>
            action !== undefined &&
            ["create", "update", "delete", "publish"].includes(action)
        );
      }
      return prev;
    },
  },

  cors: {
    origin: ["http://localhost:3000", "https://skillseekapp.com"],
    credentials: true,
  },
});
