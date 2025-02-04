export const uploadToCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
    );
    formData.append("return_delete_token", "true"); // Add this line

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    return {
      url: data.secure_url,
      deleteToken: data.delete_token,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export async function deleteCloudinaryImage(deleteToken: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy?token=${deleteToken}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Image deletion failed");
    }
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
