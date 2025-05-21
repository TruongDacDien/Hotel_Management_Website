import expressAsyncHandler from "express-async-handler";
import BookingService from "../services/bookingService.js";

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
        const newBooking = await BookingService.customerOrder(req.body);
        res.status(201).json(newBooking);
    });
}

export default new BookingController();