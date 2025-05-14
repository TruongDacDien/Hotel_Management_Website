import ChatSession from "../models/ChatSession.js";

class ChatSessionService {
    static async getAll() {
        return await ChatSession.getAll();
    }

    static async getById(sessionId) {
        const result = await ChatSession.getById(sessionId);
        if (!result) throw new Error('Chat session not found');
        return result;
    }

    static async create(data) {
        if (!data.customerId) {
            throw new Error('Missing customerId');
        }
        return await ChatSession.create(data);
    }

    static async update(sessionId, data) {
        await this.getById(sessionId); // Check existence
        return await ChatSession.update(sessionId, data);
    }

    static async delete(sessionId) {
        await this.getById(sessionId); // Check existence
        return await ChatSession.delete(sessionId);
    }
}

export default ChatSessionService;