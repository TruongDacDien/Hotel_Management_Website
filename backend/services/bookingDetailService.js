class BookingDetailService {
    constructor(bookingDetailModel) {
      this.bookingDetailModel = bookingDetailModel;
    }
  
    async getAll() {
      return this.bookingDetailModel.getAll();
    }
  
    async getById(bookingId, roomId) {
      const result = await this.bookingDetailModel.getById(bookingId, roomId);
      if (!result) throw new Error('Booking detail not found');
      return result;
    }
  
    async create(data) {
      if (!data.bookingId || !data.roomId) {
        throw new Error('Missing bookingId or roomId');
      }
      return this.bookingDetailModel.create(data);
    }
  
    async update(bookingId, roomId, data) {
      await this.getById(bookingId, roomId); // Check existence
      return this.bookingDetailModel.update(bookingId, roomId, data);
    }
  
    async delete(bookingId, roomId) {
      await this.getById(bookingId, roomId); // Check existence
      return this.bookingDetailModel.delete(bookingId, roomId);
    }
  }
  
  module.exports = BookingDetailService;
  