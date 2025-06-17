import BookingDetail from "../models/BookingDetail.js";

class BookingDetailService {
  static async getAll() {
    return await BookingDetail.getAll();
  }

  static async getById(bookingDetailId) {
    const result = await BookingDetail.getById(bookingDetailId);
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

  static async updatePaymentStatus(bookingDetailId, status, isPaid, paymentMethod) {
    if (!bookingDetailId || !status || isPaid === null || !paymentMethod) {
      throw new Error('Missing data');
    }
    return await BookingDetail.updatePaymentStatus(bookingDetailId, status, isPaid, paymentMethod);
  }

  static async cancelBookingDetail(bookingDetailId){
    if(!bookingDetailId){
      throw new Error('Missing data');
    }
    return await BookingDetail.cancelBookingDetail(bookingDetailId);
  }

  static async delete(bookingDetailId) {
    return await BookingDetail.delete(bookingDetailId);
  }
}

export default BookingDetailService;