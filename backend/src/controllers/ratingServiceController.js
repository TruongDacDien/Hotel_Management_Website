import expressAsyncHandler from "express-async-handler";
import RatingServiceService from "../services/ratingServiceService.js";

class RatingServiceController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await RatingServiceService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        const item = await RatingServiceService.getById(ratingId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await RatingServiceService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        const updated = await RatingServiceService.update(ratingId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { ratingId } = req.params;
        await RatingServiceService.delete(ratingId);
        res.status(204).end();
    });
}

export default new RatingServiceController();