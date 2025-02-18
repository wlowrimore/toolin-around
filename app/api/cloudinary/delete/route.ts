import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { deleteToken } = await request.json();

    if (!deleteToken) {
      return new Response(
        JSON.stringify({ error: "Delete token is required" }),
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy?token=${deleteToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: deleteToken }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return new Response(
        JSON.stringify({ message: "Image deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: result.error?.message || "Failed to delete image",
        }),
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
