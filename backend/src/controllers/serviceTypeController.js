import expressAsyncHandler from "express-async-handler";
import ServiceTypeService from "../services/serviceTypeService.js";

class ServiceTypeController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await ServiceTypeService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { serviceTypeId } = req.params;
        const item = await ServiceTypeService.getById(serviceTypeId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await ServiceTypeService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { serviceTypeId } = req.params;
        const updated = await ServiceTypeService.update(serviceTypeId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { serviceTypeId } = req.params;
        await ServiceTypeService.delete(serviceTypeId);
        res.status(204).end();
    });
}

export default new ServiceTypeController();