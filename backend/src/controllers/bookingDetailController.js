import expressAsyncHandler from "express-async-handler";
import BookingDetailService from "../services/bookingDetailService.js";

class BookingDetailController {
  getAll = expressAsyncHandler(async (req, res) => {
    const data = await BookingDetailService.getAll();
    res.json(data);
  });

  getById = expressAsyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;
    const item = await BookingDetailService.getById(bookingId, roomId);
    res.json(item);
  });

  create = expressAsyncHandler(async (req, res) => {
    const newItem = await BookingDetailService.create(req.body);
    res.status(201).json(newItem);
  });

  updateCheckIn = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, text } = req.body;
    const updated = await BookingDetailService.updateCheckIn(bookingDetailId, text);
    res.json(updated);
  });

  updateCheckOut = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, text } = req.body;
    const updated = await BookingDetailService.updateCheckOut(bookingDetailId, text);
    res.json(updated);
  });

  updateStatus = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, status } = req.body;
    const updated = await BookingDetailService.updateStatus(bookingDetailId, status);
    res.json(updated);
  });

  delete = expressAsyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;
    await BookingDetailService.delete(bookingId, roomId);
    res.status(204).end();
  });
}

export default new BookingDetailController();