import expressAsyncHandler from "express-async-handler";
import ChatHistoryService from "../services/chatHistoryService.js";

class ChatHistoryController {
    getAllChatHistory = expressAsyncHandler(async (req, res) => {
        const chatHistory = await ChatHistoryService.getAllChatHistory();
        res.json(chatHistory);
    });

    getChatHistoryById = expressAsyncHandler(async (req, res) => {
        const chat = await ChatHistoryService.getChatHistoryById(req.params.id);
        res.json(chat);
    });

    getChatHistoryBySessionId = expressAsyncHandler(async (req, res) => {
        const chats = await ChatHistoryService.getChatHistoryBySessionId(req.params.sessionId);
        res.json(chats);
    });

    getChatHistoryByEmployeeId = expressAsyncHandler(async (req, res) => {
        const chats = await ChatHistoryService.getChatHistoryByEmployeeId(req.params.employeeId);
        res.json(chats);
    });

    createChatHistory = expressAsyncHandler(async (req, res) => {
        const newChat = await ChatHistoryService.createChatHistory(req.body);
        res.status(201).json(newChat);
    });

    updateChatHistory = expressAsyncHandler(async (req, res) => {
        const updatedChat = await ChatHistoryService.updateChatHistory(req.params.id, req.body);
        res.json(updatedChat);
    });

    deleteChatHistory = expressAsyncHandler(async (req, res) => {
        await ChatHistoryService.deleteChatHistory(req.params.id);
        res.status(204).end();
    });
}

export default new ChatHistoryController();