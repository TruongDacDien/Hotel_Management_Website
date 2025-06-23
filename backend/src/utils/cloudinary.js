import cloudinary from "../config/cloudinary.js";

export async function handleUploadCloudinary(dataURI, publicId) {
  const res = await cloudinary.uploader.upload(dataURI, {
    public_id: publicId,
    resource_type: "auto",
    folder: "hotel_management",
  });
  return res;
}

export async function handleDestroyCloudinary(publicID) {
  const res = await cloudinary.uploader.destroy(publicID);
  return res;
}