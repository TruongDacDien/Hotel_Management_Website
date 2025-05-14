import expressAsyncHandler from "express-async-handler";
import ServiceUsageDetailService from "../services/serviceUsageDetailService.js";

class ServiceUsageDetailController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await ServiceUsageDetailService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { bookingId, serviceId } = req.params;
        const item = await ServiceUsageDetailService.getById(bookingId, serviceId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await ServiceUsageDetailService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { bookingId, serviceId } = req.params;
        const updated = await ServiceUsageDetailService.update(bookingId, serviceId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { bookingId, serviceId } = req.params;
        await ServiceUsageDetailService.delete(bookingId, serviceId);
        res.status(204).end();
    });
}

export default new ServiceUsageDetailController();