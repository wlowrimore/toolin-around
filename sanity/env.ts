export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const useCdn = false;
export const studioUrl = "/studio";
export const token = process.env.SANITY_STUDIO_API_TOKEN;

// function assertValue<T>(v: T | undefined, errorMessage: string): T {
//   if (v === undefined) {
//     throw new Error(errorMessage)
//   }

//   return v
// }
