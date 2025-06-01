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
        const bookingData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            roomRequests: req.body.roomRequests || [], // Mảng yêu cầu: [{ roomTypeId, numberOfRooms, startDay, endDay }, ...]
            serviceRequests: req.body.serviceRequests || [] // Mảng yêu cầu: [{ serviceId, quantity, offeredDate }, ...]
        };

        if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.roomRequests.length) {
            return res.status(400).json({ error: "Missing required fields or room requests" });
        }

        const result = await BookingService.customerOrder(bookingData);
        res.status(result.success ? 201 : 400).json(result);
    });

    getAllCustomerOrder = expressAsyncHandler(async (req, res) => {
        const { customerId } = req.body;
        const data = await BookingService.getAllCustomerOrder(customerId);
        res.json(data);
    });
}

export default new BookingController();