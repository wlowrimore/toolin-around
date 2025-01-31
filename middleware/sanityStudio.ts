import { jwtVerify } from "jose";

export async function validateToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SANITY_STUDIO_API_TOKEN)
    );

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return {
      valid: false,
      payload: null,
    };
  }
}
