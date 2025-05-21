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

    static async getDataRoomByDay(dateSelected) {
        if (!dateSelected) {
            throw new Error('Missing dateSelected');
        }
        try {
            // Validate date format (assuming YYYY-MM-DD or Date object)
            const date = new Date(dateSelected);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid dateSelected format');
            }
            return await Room.getDataRoomByDay(dateSelected);
        } catch (error) {
            throw new Error(`Failed to fetch room data for date ${dateSelected}: ${error.message}`);
        }
    }

    static async getEmptyRoom(startDay, endDay) {
        if (!startDay || !endDay) {
            throw new Error('Missing ngayBD or ngayKT');
        }
        try {
            // Validate date formats
            const startDate = new Date(startDay);
            const endDate = new Date(endDay);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date format for ngayBD or ngayKT');
            }
            if (startDate > endDate) {
                throw new Error('Start date cannot be after end date');
            }
            return await Room.getEmptyRoom(startDay, endDay);
        } catch (error) {
            throw new Error(`Failed to fetch available rooms from ${startDay} to ${endDay}: ${error.message}`);
        }
    }

    static async getEmptyRoomByType(startDay, endDay, roomTypeId) {
        if (!startDay || !endDay) {
            throw new Error('Missing ngayBD or ngayKT or MaLoaiPhong');
        }
        try {
            // Validate date formats
            const startDate = new Date(startDay);
            const endDate = new Date(endDay);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date format for ngayBD or ngayKT');
            }
            if (startDate > endDate) {
                throw new Error('Start date cannot be after end date');
            }
            return await Room.getEmptyRoomByType(startDay, endDay, roomTypeId);
        } catch (error) {
            throw new Error(`Failed to fetch available rooms by room type from ${startDay} to ${endDay}: ${error.message}`);
        }
    }
}

export default RoomService;