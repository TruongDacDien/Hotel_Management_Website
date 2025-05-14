import Booking from "../models/Booking.js";

class BookingService {
    static async getAll() {
        return await Booking.getAll();
    }

    static async getById(bookingId) {
        const result = await Booking.getById(bookingId);
        if (!result) throw new Error('Booking not found');
        return result;
    }

    static async create(data) {
        if (!data.customerId) {
            throw new Error('Missing customerId');
        }
        return await Booking.create(data);
    }

    static async update(bookingId, data) {
        await this.getById(bookingId); // Check existence
        return await Booking.update(bookingId, data);
    }

    static async delete(bookingId) {
        await this.getById(bookingId); // Check existence
        return await Booking.delete(bookingId);
    }
}

export default BookingService;