class RoomService {
    constructor(roomModel) {
        this.roomModel = roomModel;
    }

    async getAll() {
        return this.roomModel.getAll();
    }

    async getById(roomId) {
        const result = await this.roomModel.getById(roomId);
        if (!result) throw new Error('Room not found');
        return result;
    }

    async create(data) {
        if (!data.roomNumber) {
            throw new Error('Missing roomNumber');
        }
        return this.roomModel.create(data);
    }

    async update(roomId, data) {
        await this.getById(roomId); // Check existence
        return this.roomModel.update(roomId, data);
    }

    async delete(roomId) {
        await this.getById(roomId); // Check existence
        return this.roomModel.delete(roomId);
    }
}

module.exports = RoomService;