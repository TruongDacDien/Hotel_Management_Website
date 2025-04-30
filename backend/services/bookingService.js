class BookingService {
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
    }

    async getAll() {
        return this.bookingModel.getAll();
    }

    async getById(bookingId) {
        const result = await this.bookingModel.getById(bookingId);
        if (!result) throw new Error('Booking not found');
        return result;
    }

    async create(data) {
        if (!data.customerId) {
            throw new Error('Missing customerId');
        }
        return this.bookingModel.create(data);
    }

    async update(bookingId, data) {
        await this.getById(bookingId); // Check existence
        return this.bookingModel.update(bookingId, data);
    }

    async delete(bookingId) {
        await this.getById(bookingId); // Check existence
        return this.bookingModel.delete(bookingId);
    }
}

module.exports = BookingService;