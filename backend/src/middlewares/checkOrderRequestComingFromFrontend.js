import expressAsyncHandler from "express-async-handler";
import RoomTypeService from "../services/roomTypeService.js";
import ServiceService from "../services/serviceService.js";

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(async (req, res, next) => {
  const { isOnline, fullName, email, phone, roomRequests = [], serviceRequests = [], totalPrice } = req.body;

  // Validate required fields
  if (!fullName || !email || !phone || !roomRequests || !Array.isArray(roomRequests)) {
    return res.status(400).json({
      error: -1,
      message: "Missing required fields: fullName, email, phone, or roomRequests",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: -1,
      message: "Invalid email format",
    });
  }

  // Validate phone format (assuming Vietnamese phone number)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: -1,
      message: "Invalid phone number format",
    });
  }

  // Validate roomRequests
  for (const room of roomRequests) {
    if (!room.roomTypeId || !room.numberOfRooms || !room.startDay || !room.endDay) {
      return res.status(400).json({
        error: -1,
        message: "Invalid room request: missing roomTypeId, numberOfRooms, startDay, or endDay",
      });
    }
    // Validate dates
    const start = new Date(room.startDay);
    const end = new Date(room.endDay);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({
        error: -1,
        message: "Invalid dates in room request",
      });
    }
  }

  // Validate serviceRequests
  if (serviceRequests && Array.isArray(serviceRequests)) {
    for (const service of serviceRequests) {
      if (!service.serviceId || !service.quantity || !service.offeredDate) {
        return res.status(400).json({
          error: -1,
          message: "Invalid service request: missing serviceId, quantity, or offeredDate",
        });
      }
    }
  }

  // Calculate total price with 10% tax
  let roomTotalPrice = 0;
  let serviceTotalPrice = 0;
  const TAX_RATE = 1.1; // 10% tax

  // Calculate room prices with tax
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
    const roomPrice = roomType.GiaNgay * diffInDays * room.numberOfRooms;
    roomTotalPrice += roomPrice * TAX_RATE; // Apply 10% tax
  }

  // Calculate service prices with tax
  if (serviceRequests && Array.isArray(serviceRequests)) {
    for (const service of serviceRequests) {
      const serviceInfo = await ServiceService.getServiceById(service.serviceId);
      if (!serviceInfo) {
        return res.status(400).json({
          error: -1,
          message: `Invalid service ID: ${service.serviceId}`,
        });
      }
      const servicePrice = serviceInfo.Gia * service.quantity;
      serviceTotalPrice += servicePrice * TAX_RATE; // Apply 10% tax
    }
  }

  // Calculate total price
  const calculatedTotalPrice = roomTotalPrice + serviceTotalPrice;

  // Compare calculated total price with provided totalPrice
  if (totalPrice === undefined || Math.abs(calculatedTotalPrice - totalPrice) > 100) {
    return res.status(400).json({
      error: -1,
      message: "Total price does not match calculated price",
    });
  }

  // Attach bookingData to req for use in createPaymentLink
  req.bookingData = {
    isOnline,
    fullName,
    email,
    phone,
    roomRequests,
    serviceRequests,
  };

  next();
});