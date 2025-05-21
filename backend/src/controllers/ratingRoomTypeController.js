import expressAsyncHandler from "express-async-handler";
import RatingRoomTypeService from "../services/ratingRoomTypeService.js";

class RatingRoomTypeController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await RatingRoomTypeService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        const item = await RatingRoomTypeService.getById(ratingId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await RatingRoomTypeService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        const updated = await RatingRoomTypeService.update(ratingId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        await RatingRoomTypeService.delete(ratingId);
        res.status(204).end();
    });
}

export default new RatingRoomTypeController();