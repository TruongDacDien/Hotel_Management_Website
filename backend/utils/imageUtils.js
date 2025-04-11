// utils/imageUtils.js
const { cloudinary } = require('../config/cloudinary');

class ImageUtils {
  static async uploadImage(filePath, folder = 'general') {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hotel_management/${folder}`
    });
    return result.secure_url;
  }

  static async deleteImage(imageUrl) {
    if (!imageUrl) return true;
    
    try {
      const publicId = imageUrl
        .split('/')
        .slice(-2)
        .join('/')
        .replace(/\.[^/.]+$/, '');
      
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  }

  static async replaceImage(oldImageUrl, newFilePath, folder = 'general') {
    await this.deleteImage(oldImageUrl);
    return this.uploadImage(newFilePath, folder);
  }
}

module.exports = ImageUtils;