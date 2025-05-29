import RatingService from "../models/RatingService.js";

class RatingServiceService {
  static async getAll() {
    return await RatingService.getAll();
  }

  static async getById(ratingId) {
    const result = await RatingService.getById(ratingId);
    if (!result) {
      throw new Error("Không tìm thấy đánh giá dịch vụ");
    }
    return result;
  }

  static async getByServiceId(serviceId) {
    const result = await RatingService.getByServiceId(serviceId);
    if (!result) {
      throw new Error("Không tìm thấy đánh giá");
    }
    return result;
  }

  static async create(data) {
    if (!data.MaDV || !data.MaTKKH || !data.SoSao || !data.NoiDung) {
      throw new Error("Thiếu các trường bắt buộc");
    }
    if (typeof data.SoSao !== "number" || data.SoSao < 1 || data.SoSao > 5) {
      throw new Error("Giá trị số sao không hợp lệ");
    }
    return await RatingService.create(data);
  }

  static async update(ratingId, data) {
    await this.getById(ratingId); // Kiểm tra tồn tại
    return await RatingService.update(ratingId, data);
  }

  static async delete(ratingId) {
    await this.getById(ratingId); // Kiểm tra tồn tại
    return await RatingService.delete(ratingId);
  }
}

export default RatingServiceService;
