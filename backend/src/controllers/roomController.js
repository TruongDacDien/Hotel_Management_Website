import expressAsyncHandler from "express-async-handler";
import RoomService from "../services/roomService.js";

class RoomController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await RoomService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { roomId } = req.params;
        const item = await RoomService.getById(roomId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await RoomService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { roomId } = req.params;
        const updated = await RoomService.update(roomId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { roomId } = req.params;
        await RoomService.delete(roomId);
        res.status(204).end();
    });

    getDataRoomByDay = expressAsyncHandler(async (req, res) => {
        const { dateSelected } = req.query;
        const data = await RoomService.getDataRoomByDay(dateSelected);
        res.json(data);
    });

    getEmptyRoom = expressAsyncHandler(async (req, res) => {
        const { startDay, endDay } = req.query;
        const data = await RoomService.getEmptyRoom(startDay, endDay);
        res.json(data);
    });
}

export default new RoomController();