"use client";

import { LoginMethod } from "sanity";
import { defineConfig } from "sanity";
import { validateToken } from "./middleware/sanityStudio";
import type { SanityDocument } from "@sanity/types";
import type { User } from "next-auth";

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
      if (schemaType === "listing") {
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
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});
