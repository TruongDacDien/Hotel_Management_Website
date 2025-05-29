import RatingRoomType from "../models/RatingRoomType.js";

class RatingRoomTypeService {
  static async getAll() {
    return await RatingRoomType.getAll();
  }

  static async getById(ratingId) {
    const result = await RatingRoomType.getById(ratingId);
    if (!result) {
      throw new Error("Không tìm thấy đánh giá");
    }
    return result;
  }

  static async getByRoomTypeId(roomTypeId) {
    const result = await RatingRoomType.getByRoomTypeId(roomTypeId);
    if (!result) {
      throw new Error("Không tìm thấy đánh giá");
    }
    return result;
  }

  static async create(data) {
    if (
      !data.MaLoaiPhong ||
      !data.MaTKKH ||
      !data.SoSao ||
      data.NoiDung === ""
    ) {
      throw new Error("Thiếu các trường bắt buộc");
    }
    if (typeof data.SoSao !== "number" || data.SoSao < 1 || data.SoSao > 5) {
      throw new Error("Giá trị số sao không hợp lệ");
    }
    return await RatingRoomType.create(data);
  }

  static async update(ratingId, data) {
    await this.getById(ratingId); // Kiểm tra tồn tại
    return await RatingRoomType.update(ratingId, data);
  }

  static async delete(ratingId) {
    await this.getById(ratingId); // Kiểm tra tồn tại
    return await RatingRoomType.delete(ratingId);
  }
}

export default RatingRoomTypeService;
