import expressAsyncHandler from "express-async-handler";
import ChatSessionService from "../services/chatSessionService.js";

class ChatSessionController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await ChatSessionService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { sessionId } = req.params;
        const item = await ChatSessionService.getById(sessionId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await ChatSessionService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { sessionId } = req.params;
        const updated = await ChatSessionService.update(sessionId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { sessionId } = req.params;
        await ChatSessionService.delete(sessionId);
        res.status(204).end();
    });
}

export default new ChatSessionController();