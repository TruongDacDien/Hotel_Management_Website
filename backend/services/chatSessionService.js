class ChatSessionService {
    constructor(chatSessionModel) {
        this.chatSessionModel = chatSessionModel;
    }

    async getAll() {
        return this.chatSessionModel.getAll();
    }

    async getById(sessionId) {
        const result = await this.chatSessionModel.getById(sessionId);
        if (!result) throw new Error('Chat session not found');
        return result;
    }

    async create(data) {
        if (!data.customerId) {
            throw new Error('Missing customerId');
        }
        return this.chatSessionModel.create(data);
    }

    async update(sessionId, data) {
        await this.getById(sessionId); // Check existence
        return this.chatSessionModel.update(sessionId, data);
    }

    async delete(sessionId) {
        await this.getById(sessionId); // Check existence
        return this.chatSessionModel.delete(sessionId);
    }
}

module.exports = ChatSessionService;