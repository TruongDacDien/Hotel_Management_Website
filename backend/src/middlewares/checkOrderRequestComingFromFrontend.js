import expressAsyncHandler from "express-async-handler";
import RoomTypeService from "../services/roomTypeService.js"; // Giả định để lấy giá phòng
import ServiceService from "../services/serviceService.js"; // Giả định để lấy giá dịch vụ

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(async (req, res, next) => {
  const { roomUsed, serviceUsed, totalPrice, fullName, email, phone } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!roomUsed || !Array.isArray(roomUsed) || !fullName || !email || !phone) {
    return res.status(400).json({
      error: -1,
      message: "Missing required fields: roomUsed, fullName, email, or phone",
    });
  }

  // Kiểm tra email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: -1,
      message: "Invalid email format",
    });
  }

  // Kiểm tra phone hợp lệ (giả định số điện thoại Việt Nam)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: -1,
      message: "Invalid phone number format",
    });
  }

  // Chuyển đổi roomUsed thành roomRequests
  const roomRequests = roomUsed.map((room) => ({
    roomTypeId: room.roomTypeId,
    numberOfRooms: room.quantity || 1,
    startDay: room.startDay,
    endDay: room.endDay,
  }));

  // Chuyển đổi serviceUsed thành serviceRequests
  const serviceRequests = serviceUsed && Array.isArray(serviceUsed)
    ? serviceUsed.map((service) => ({
        serviceId: service.serviceId,
        quantity: service.quantity || 1,
        offeredDate: service.offeredDate,
      }))
    : [];

  // Kiểm tra dữ liệu roomRequests
  for (const room of roomRequests) {
    if (!room.roomTypeId || !room.numberOfRooms || !room.startDay || !room.endDay) {
      return res.status(400).json({
        error: -1,
        message: "Invalid room request: missing roomTypeId, numberOfRooms, startDay, or endDay",
      });
    }
    // Kiểm tra ngày hợp lệ
    const start = new Date(room.startDay);
    const end = new Date(room.endDay);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({
        error: -1,
        message: "Invalid dates in room request",
      });
    }
  }

  // Kiểm tra dữ liệu serviceRequests
  for (const service of serviceRequests) {
    if (!service.serviceId || !service.quantity || !service.offeredDate) {
      return res.status(400).json({
        error: -1,
        message: "Invalid service request: missing serviceId, quantity, or offeredDate",
      });
    }
  }

  // Tính tổng tiền từ roomUsed và serviceUsed
  let calculatedTotalPrice = 0;

  // Tính giá phòng
  for (const room of roomRequests) {
    const roomType = await RoomTypeService.getById(room.roomTypeId);
    if (!roomType) {
      return res.status(400).json({
        error: -1,
        message: `Invalid room type ID: ${room.roomTypeId}`,
      });
    }
    const start = new Date(room.startDay);
    const end = new Date(room.endDay);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    calculatedTotalPrice += roomType.GiaNgay * diffInDays * room.numberOfRooms;
  }

  // Tính giá dịch vụ
  for (const service of serviceRequests) {
    const serviceInfo = await ServiceService.getById(service.serviceId);
    if (!serviceInfo) {
      return res.status(400).json({
        error: -1,
        message: `Invalid service ID: ${service.serviceId}`,
      });
    }
    calculatedTotalPrice += serviceInfo.Gia * service.quantity;
  }

  // So sánh totalPrice với giá tính được
  if (Math.abs(calculatedTotalPrice - totalPrice) > 100) { // Cho phép sai số nhỏ
    return res.status(400).json({
      error: -1,
      message: "Total price does not match calculated price",
    });
  }

  // Gắn bookingData vào req để sử dụng trong createPaymentLink
  req.bookingData = {
    fullName,
    email,
    phone,
    roomRequests,
    serviceRequests,
  };

  next();
});