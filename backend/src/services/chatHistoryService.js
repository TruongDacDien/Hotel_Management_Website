import ChatHistory from "../models/ChatHistory.js";

class ChatHistoryService {
    static async getAllChatHistory() {
        return await ChatHistory.getAll();
    }

    static async getChatHistoryById(id) {
        const chat = await ChatHistory.getById(id);
        if (!chat) {
            throw new Error('Chat history not found');
        }
        return chat;
    }

    static async getChatHistoryBySessionId(sessionId) {
        const chats = await ChatHistory.getBySessionId(sessionId);
        if (!chats || chats.length === 0) {
            throw new Error('No chat history found for this session');
        }
        return chats;
    }

    static async createChatHistory(chatData) {
        // Validate required fields
        if (!chatData.MaPC || !chatData.NguoiGui || !chatData.NoiDung) {
            throw new Error('Missing required fields: MaPC, NguoiGui, NoiDung');
        }

        // Set current time if not provided
        if (!chatData.ThoiGianGui) {
            chatData.ThoiGianGui = new Date();
        }

        return await ChatHistory.create(chatData);
    }

    static async updateChatHistory(id, chatData) {
        await this.getChatHistoryById(id); // Check if exists
        return await ChatHistory.update(id, chatData);
    }

    static async deleteChatHistory(id) {
        await this.getChatHistoryById(id); // Check if exists
        return await ChatHistory.delete(id);
    }
}

export default ChatHistoryService;