import cloudinary from "../config/cloudinary.js";

export async function handleUploadCloudinary(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "hotel_management",
  });
  return res;
}

export async function handleDestroyCloudinary(publicID) {
  const res = await cloudinary.uploader.destroy(publicID);
  return res;
}