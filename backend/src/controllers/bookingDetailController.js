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

  update = expressAsyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;
    const updated = await BookingDetailService.update(bookingId, roomId, req.body);
    res.json(updated);
  });

  delete = expressAsyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;
    await BookingDetailService.delete(bookingId, roomId);
    res.status(204).end();
  });
}

export default new BookingDetailController();