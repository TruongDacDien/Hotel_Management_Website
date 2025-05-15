import AmenityDetail from "../models/AmenityDetail.js";

class AmenityDetailService {
  static async getAllAmenityDetails() {
    return await AmenityDetail.getAll();
  }

  static async getAmenityDetailById(id) {
    const detail = await AmenityDetail.getById(id);
    if (!detail) {
      throw new Error("Amenity detail not found");
    }
    return detail;
  }

  static async getAmenitiesByRoomType(roomTypeId) {
    return await AmenityDetail.getByRoomType(roomTypeId);
  }

  static async createAmenityDetail(detailData) {
    // Validate data
    if (
      !detailData.MaTN ||
      !detailData.MaLoaiPhong ||
      detailData.SL === undefined
    ) {
      throw new Error("Missing required fields");
    }
    return await AmenityDetail.create(detailData);
  }

  static async updateAmenityDetail(id, detailData) {
    // Check if exists
    await this.getAmenityDetailById(id);
    return await AmenityDetail.update(id, detailData);
  }

  static async deleteAmenityDetail(id) {
    // Check if exists
    await this.getAmenityDetailById(id);
    return await AmenityDetail.softDelete(id);
  }
}

export default AmenityDetailService;
