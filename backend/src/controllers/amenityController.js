import expressAsyncHandler from "express-async-handler";
import AmenityService from "../services/amenityService.js";

class AmenityController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await AmenityService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { amenityId } = req.params;
        const item = await AmenityService.getById(amenityId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await AmenityService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { amenityId } = req.params;
        const updated = await AmenityService.update(amenityId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { amenityId } = req.params;
        await AmenityService.delete(amenityId);
        res.status(204).end();
    });
}

export default new AmenityController();