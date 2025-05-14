import RoomType from "../models/RoomType.js";

class RoomTypeService {
    static async getAll() {
        return await RoomType.getAll();
    }

    static async getById(roomTypeId) {
        const result = await RoomType.getById(roomTypeId);
        if (!result) throw new Error('Room type not found');
        return result;
    }

    static async create(data) {
        if (!data.name) {
            throw new Error('Missing name');
        }
        return await RoomType.create(data);
    }

    static async update(roomTypeId, data) {
        await this.getById(roomTypeId); // Check existence
        return await RoomType.update(roomTypeId, data);
    }

    static async delete(roomTypeId) {
        await this.getById(roomTypeId); // Check existence
        return await RoomType.delete(roomTypeId);
    }
}

export default RoomTypeService;