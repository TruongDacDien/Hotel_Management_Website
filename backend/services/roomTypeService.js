class RoomTypeService {
    constructor(roomTypeModel) {
        this.roomTypeModel = roomTypeModel;
    }

    async getAll() {
        return this.roomTypeModel.getAll();
    }

    async getById(roomTypeId) {
        const result = await this.roomTypeModel.getById(roomTypeId);
        if (!result) throw new Error('Room type not found');
        return result;
    }

    async create(data) {
        if (!data.name) {
            throw new Error('Missing name');
        }
        return this.roomTypeModel.create(data);
    }

    async update(roomTypeId, data) {
        await this.getById(roomTypeId); // Check existence
        return this.roomTypeModel.update(roomTypeId, data);
    }

    async delete(roomTypeId) {
        await this.getById(roomTypeId); // Check existence
        return this.roomTypeModel.delete(roomTypeId);
    }
}

module.exports = RoomTypeService;