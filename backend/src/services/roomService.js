import Room from "../models/Room.js";

class RoomService {
    static async getAll() {
        return await Room.getAll();
    }

    static async getById(roomId) {
        const result = await Room.getById(roomId);
        if (!result) throw new Error('Room not found');
        return result;
    }

    static async create(data) {
        if (!data.roomNumber) {
            throw new Error('Missing roomNumber');
        }
        return await Room.create(data);
    }

    static async update(roomId, data) {
        await this.getById(roomId); // Check existence
        return await Room.update(roomId, data);
    }

    static async delete(roomId) {
        await this.getById(roomId); // Check existence
        return await Room.delete(roomId);
    }
}

export default RoomService;