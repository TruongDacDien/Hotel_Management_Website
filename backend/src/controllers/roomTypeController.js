import expressAsyncHandler from "express-async-handler";
import RoomTypeService from "../services/roomTypeService.js";

class RoomTypeController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await RoomTypeService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { roomTypeId } = req.params;
        const item = await RoomTypeService.getById(roomTypeId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await RoomTypeService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { roomTypeId } = req.params;
        const updated = await RoomTypeService.update(roomTypeId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { roomTypeId } = req.params;
        await RoomTypeService.delete(roomTypeId);
        res.status(204).end();
    });
}

export default new RoomTypeController();