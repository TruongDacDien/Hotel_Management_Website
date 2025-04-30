class ChatHistoryController {
    constructor(chatHistoryService) {
        this.chatHistoryService = chatHistoryService;
        
        // Bind all methods
        this.getAllChatHistory = this.getAllChatHistory.bind(this);
        this.getChatHistoryById = this.getChatHistoryById.bind(this);
        this.getChatHistoryBySessionId = this.getChatHistoryBySessionId.bind(this);
        this.getChatHistoryByEmployeeId = this.getChatHistoryByEmployeeId.bind(this);
        this.createChatHistory = this.createChatHistory.bind(this);
        this.updateChatHistory = this.updateChatHistory.bind(this);
        this.deleteChatHistory = this.deleteChatHistory.bind(this);
    }

    async getAllChatHistory(req, res, next) {
        try {
            const chatHistory = await this.chatHistoryService.getAllChatHistory();
            res.json(chatHistory);
        } catch (err) {
            next(err);
        }
    }

    async getChatHistoryById(req, res, next) {
        try {
            const chat = await this.chatHistoryService.getChatHistoryById(req.params.id);
            res.json(chat);
        } catch (err) {
            next(err);
        }
    }

    async getChatHistoryBySessionId(req, res, next) {
        try {
            const chats = await this.chatHistoryService.getChatHistoryBySessionId(req.params.sessionId);
            res.json(chats);
        } catch (err) {
            next(err);
        }
    }

    async getChatHistoryByEmployeeId(req, res, next) {
        try {
            const chats = await this.chatHistoryService.getChatHistoryByEmployeeId(req.params.employeeId);
            res.json(chats);
        } catch (err) {
            next(err);
        }
    }

    async createChatHistory(req, res, next) {
        try {
            const newChat = await this.chatHistoryService.createChatHistory(req.body);
            res.status(201).json(newChat);
        } catch (err) {
            next(err);
        }
    }

    async updateChatHistory(req, res, next) {
        try {
            const updatedChat = await this.chatHistoryService.updateChatHistory(
                req.params.id,
                req.body
            );
            res.json(updatedChat);
        } catch (err) {
            next(err);
        }
    }

    async deleteChatHistory(req, res, next) {
        try {
            await this.chatHistoryService.deleteChatHistory(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ChatHistoryController;