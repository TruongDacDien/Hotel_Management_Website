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

  static async updateCheckIn(bookingDetailId, text) {
    if (!bookingDetailId || !text) {
      throw new Error('Missing data');
    }
    return await BookingDetail.updateCheckIn(bookingDetailId, text);
  }

  static async updateCheckOut(bookingDetailId, text) {
    if (!bookingDetailId || !text) {
      throw new Error('Missing data');
    }
    return await BookingDetail.updateCheckOut(bookingDetailId, text);
  }

  static async updateStatus(bookingDetailId, status) {
    if (!bookingDetailId || !status) {
      throw new Error('Missing data');
    }
    return await BookingDetail.updateStatus(bookingDetailId, status);
  }

  static async delete(bookingId, roomId) {
    await this.getById(bookingId, roomId); // Check existence
    return await BookingDetail.delete(bookingId, roomId);
  }
}

export default BookingDetailService;