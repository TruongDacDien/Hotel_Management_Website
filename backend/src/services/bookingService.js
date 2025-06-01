import Booking from "../models/Booking.js";
import RoomService from "./roomService.js";
import CustomerAccountService from "./customerAccountService.js";
import ServiceService from "./serviceService.js";
import ServiceUsageDetailService from "./serviceUsageDetailService.js";
import BookingDetailService from "./bookingDetailService.js";

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
        if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
            throw new Error('Missing required fields');
        }

        const customer = await CustomerAccountService.findUserByEmail(bookingData.email);

        const { roomRequests, serviceRequests } = bookingData;
        const roomResults = [];
        let overallRoomSuccess = false;
        const serviceResults = [];
        let overallServiceSuccess = false;

        // Xử lý từng yêu cầu đặt phòng
        for (const request of roomRequests) {
            const { roomTypeId, numberOfRooms, startDay, endDay } = request;

            if (!roomTypeId || !numberOfRooms || !startDay || !endDay) {
                roomResults.push({
                    roomTypeId,
                    requestedRooms: numberOfRooms || 0,
                    bookedRooms: 0,
                    failedRooms: numberOfRooms || 0,
                    bookings: [],
                    message: `For room type ${roomTypeId}: Failed to book due to missing required fields.`,
                });
                continue;
            }

            // Kiểm tra phòng trống cho loại phòng và khoảng thời gian này
            const listRoom = await RoomService.getEmptyRoomByType(startDay, endDay, roomTypeId);
            const availableRooms = listRoom?.length || 0;
            const roomsToBook = Math.min(numberOfRooms, availableRooms); // Số phòng có thể đặt
            const failedRooms = numberOfRooms - roomsToBook; // Số phòng không thể đặt

            const bookingRoomResults = [];
            let numberOfCustomers;

            // Hàm chọn phòng ngẫu nhiên
            const getRandomRoom = (rooms) => {
                const randomIndex = Math.floor(Math.random() * rooms.length);
                numberOfCustomers = rooms[randomIndex].SoNguoiToiDa;
                const selectedRoom = rooms[randomIndex].SoPhong;
                rooms.splice(randomIndex, 1); // Xóa phòng đã chọn
                return selectedRoom;
            };

            // Đặt các phòng khả dụng
            for (let i = 0; i < roomsToBook; i++) {
                if (listRoom.length === 0) break; // Không còn phòng
                const selectedRoom = getRandomRoom(listRoom);
                const bookingRoom = await Booking.customerOrder(customer.MaKH, selectedRoom, numberOfCustomers, {
                    startDay,
                    endDay,
                    roomTypeId
                });
                bookingRoomResults.push(bookingRoom);
                overallRoomSuccess = true; // Có ít nhất một phòng được đặt
            }

            // Lưu kết quả cho yêu cầu này
            roomResults.push({
                roomTypeId,
                requestedRooms: numberOfRooms,
                bookedRooms: roomsToBook,
                failedRooms,
                startDay,
                endDay,
                bookings: bookingRoomResults,
                message: failedRooms > 0
                    ? `For room type ${roomTypeId} from ${startDay} to ${endDay}: Booked ${roomsToBook} room(s), failed to book ${failedRooms} room(s) due to insufficient availability.`
                    : `For room type ${roomTypeId} from ${startDay} to ${endDay}: Successfully booked ${roomsToBook} room(s).`,
            });
        }

        for (const roomResult of roomResults) {
            for (const booking of roomResult.bookings) {
                await BookingDetailService.updateStatus(booking.MaCTPT, "Đã thanh toán online");
            }
        }

        // Xử lý từng yêu cầu đặt dịch vụ
        for (const request of serviceRequests) {
            const { serviceId, quantity, offeredDate } = request;

            if (!serviceId || !quantity || !offeredDate) {
                serviceResults.push({
                    serviceId,
                    requestedServices: quantity || 0,
                    bookedServices: 0,
                    failedServices: quantity || 0,
                    totalMoney: 0,
                    services: [],
                    message: `For service ${serviceId}: Failed to book due to missing required fields.`,
                });
                continue;
            }

            // Kiểm tra dịch vụ và số lượng còn lại
            const serviceSelected = await ServiceService.getServiceById(serviceId);
            if (!serviceSelected) {
                serviceResults.push({
                    serviceId,
                    requestedServices: quantity,
                    bookedServices: 0,
                    failedServices: quantity,
                    totalMoney: 0,
                    services: [],
                    message: `For service ${serviceId}: Failed to book due to invalid service ID.`,
                });
                continue;
            }

            const availableServices = serviceSelected.SoLuong || 0;
            const servicesToBook = Math.min(quantity, availableServices); // Số dịch vụ có thể đặt
            const failedServices = quantity - servicesToBook; // Số dịch vụ không thể đặt
            const totalMoney = servicesToBook * serviceSelected.Gia; // Tính tổng tiền

            const bookingServiceResults = [];

            // Đặt các dịch vụ khả dụng
            if (servicesToBook > 0) {
                const bookingService = await ServiceUsageDetailService.create({
                    customerId: customer.MaKH,
                    serviceId,
                    quantity: servicesToBook,
                    offeredDate,
                    totalMoney,
                });
                bookingServiceResults.push(bookingService);
                // Cập nhật số lượng dịch vụ còn lại
                await ServiceService.findByIdAndUpdateQuantity(serviceId, availableServices - servicesToBook);
                overallServiceSuccess = true; // Có ít nhất một dịch vụ được đặt
            }

            // Lưu kết quả cho yêu cầu dịch vụ
            serviceResults.push({
                serviceId,
                requestedServices: quantity,
                bookedServices: servicesToBook,
                failedServices,
                totalMoney,
                offeredDate,
                services: bookingServiceResults,
                message: failedServices > 0
                    ? `For service ${serviceId} on ${offeredDate}: Booked ${servicesToBook} service(s), failed to book ${failedServices} service(s) due to insufficient availability.`
                    : `For service ${serviceId} on ${offeredDate}: Successfully booked ${servicesToBook} service(s).`,
            });
        }

        // Tạo phản hồi tổng thể
        const response = {
            success: overallRoomSuccess || overallServiceSuccess,
            roomResults,
            serviceResults,
            message: overallRoomSuccess && overallServiceSuccess
                ? "Some rooms and services were booked successfully. Check results for details."
                : overallRoomSuccess
                    ? "Some rooms were booked successfully. Check results for details."
                    : overallServiceSuccess
                        ? "Some services were booked successfully. Check results for details."
                        : "Failed to book any rooms or services due to insufficient availability.",
        };

        if (!overallRoomSuccess && !overallServiceSuccess) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getAllCustomerOrder(customerId) {
        return await Booking.getAllCustomerOrder(customerId);
    }
}

export default BookingService;