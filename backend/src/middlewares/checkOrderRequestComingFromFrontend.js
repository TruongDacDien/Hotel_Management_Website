import expressAsyncHandler from "express-async-handler";
import RoomTypeService from "../services/roomTypeService.js";
import ServiceService from "../services/serviceService.js";

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(async (req, res, next) => {
  const { fullName, email, phone, roomRequests = [], serviceRequests = [], totalPrice } = req.body;

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

  // Calculate total price
  let calculatedTotalPrice = 0;

  // Calculate room prices
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

  // Calculate service prices
  if (serviceRequests && Array.isArray(serviceRequests)) {
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
  }

  // Compare calculated total price with provided totalPrice
  if (totalPrice === undefined || Math.abs(calculatedTotalPrice - totalPrice) > 100) {
    return res.status(400).json({
      error: -1,
      message: "Total price does not match calculated price",
    });
  }

  // Attach bookingData to req for use in createPaymentLink
  req.bookingData = {
    fullName,
    email,
    phone,
    roomRequests,
    serviceRequests,
  };

  next();
});