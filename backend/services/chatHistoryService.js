class ChatHistoryService {
    constructor(chatHistoryModel) {
        this.chatHistoryModel = chatHistoryModel;
    }

    async getAllChatHistory() {
        return this.chatHistoryModel.getAll();
    }

    async getChatHistoryById(id) {
        const chat = await this.chatHistoryModel.getById(id);
        if (!chat) {
            throw new Error('Chat history not found');
        }
        return chat;
    }

    async getChatHistoryBySessionId(sessionId) {
        const chats = await this.chatHistoryModel.getBySessionId(sessionId);
        if (!chats || chats.length === 0) {
            throw new Error('No chat history found for this session');
        }
        return chats;
    }

    async createChatHistory(chatData) {
        // Validate required fields
        if (!chatData.MaPC || !chatData.NguoiGui || !chatData.NoiDung) {
            throw new Error('Missing required fields: MaPC, NguoiGui, NoiDung');
        }

        // Set current time if not provided
        if (!chatData.ThoiGianGui) {
            chatData.ThoiGianGui = new Date();
        }

        return this.chatHistoryModel.create(chatData);
    }

    async updateChatHistory(id, chatData) {
        await this.getChatHistoryById(id); // Check if exists
        return this.chatHistoryModel.update(id, chatData);
    }

    async deleteChatHistory(id) {
        await this.getChatHistoryById(id); // Check if exists
        return this.chatHistoryModel.delete(id);
    }
}

module.exports = ChatHistoryService;