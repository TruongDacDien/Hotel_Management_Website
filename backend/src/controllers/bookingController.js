import expressAsyncHandler from "express-async-handler";
import BookingService from "../services/bookingService.js";
import BookingDetailService from "../services/bookingDetailService.js";

class BookingController {
  getAll = expressAsyncHandler(async (req, res) => {
    const data = await BookingService.getAll();
    res.json(data);
  });

  getById = expressAsyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const item = await BookingService.getById(bookingId);
    res.json(item);
  });

  create = expressAsyncHandler(async (req, res) => {
    const newItem = await BookingService.create(req.body);
    res.status(201).json(newItem);
  });

  update = expressAsyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const updated = await BookingService.update(bookingId, req.body);
    res.json(updated);
  });

  delete = expressAsyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    await BookingService.delete(bookingId);
    res.status(204).end();
  });

  customerOrder = expressAsyncHandler(async (req, res) => {
    const bookingData = {
      isOnline: req.body.isOnline,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      roomRequests: req.body.roomRequests || [], // Mảng yêu cầu: [{ roomTypeId, numberOfRooms, startDay, endDay }, ...]
      serviceRequests: req.body.serviceRequests || [], // Mảng yêu cầu: [{ serviceId, quantity, offeredDate }, ...]
    };
    const result = await BookingService.customerOrder(bookingData);
    res.status(result.success ? 201 : 400).json(result);
  });

  getAllCustomerOrder = expressAsyncHandler(async (req, res) => {
    const customerId = req.query.customerId;
    const data = await BookingService.getAllCustomerOrder(customerId);
    res.json(data);
  });
}

export default new BookingController();
