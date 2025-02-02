import { createClient } from "next-sanity";

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION || "2024-02-01",
  token: process.env.SANITY_STUDIO_API_TOKEN,
  useCdn: false,
});
console.log("PROJECT_ID:", writeClient.config().projectId);
console.log("DATASET:", writeClient.config().dataset);
console.log("SANITY_STUDIO_API_TOKEN:", writeClient.config().token);
