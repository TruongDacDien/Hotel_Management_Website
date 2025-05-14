import BookingDetail from "../models/BookingDetail.js";

class BookingDetailService {
  static async getAll() {
    return await BookingDetail.getAll();
  }

  static async getById(bookingId, roomId) {
    const result = await BookingDetail.getById(bookingId, roomId);
    if (!result) throw new Error('Booking detail not found');
    return result;
  }

  static async create(data) {
    if (!data.bookingId || !data.roomId) {
      throw new Error('Missing bookingId or roomId');
    }
    return await BookingDetail.create(data);
  }

  static async update(bookingId, roomId, data) {
    await this.getById(bookingId, roomId); // Check existence
    return await BookingDetail.update(bookingId, roomId, data);
  }

  static async delete(bookingId, roomId) {
    await this.getById(bookingId, roomId); // Check existence
    return await BookingDetail.delete(bookingId, roomId);
  }
}

export default BookingDetailService;