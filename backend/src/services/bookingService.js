import Booking from "../models/Booking.js";
import RoomService from "./roomService.js";
import CustomerService from "./customerService.js";

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

    static async customerOrder(bookingData) {
        if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.startDay || !bookingData.endDay) {
            throw new Error('Missing required fields');
        }
        const listRoom = await RoomService.getEmptyRoomByType(bookingData.startDay, bookingData.endDay, bookingData.roomTypeId);

        if (!listRoom || listRoom.length === 0) {
            throw new Error('No available rooms for the selected dates and room type');
        }

        let numberOfCustomers;
        const getRandomRoom = (rooms) => {
            const randomIndex = Math.floor(Math.random() * rooms.length);
            numberOfCustomers = rooms[randomIndex].SoNguoiToiDa;
            return rooms[randomIndex].SoPhong;
        };
        const selectedRoom = getRandomRoom(listRoom);

        const customer = await CustomerService.getCustomerByPhone(bookingData.phone);
        return await Booking.customerOrder(customer.MaKH, selectedRoom, numberOfCustomers, bookingData);
    }
}

export default BookingService;