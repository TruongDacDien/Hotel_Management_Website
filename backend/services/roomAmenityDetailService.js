class RoomAmenityDetailService {
    constructor(roomAmenityDetailModel) {
        this.roomAmenityDetailModel = roomAmenityDetailModel;
    }

    async getAllRoomAmenityDetails() {
        return this.roomAmenityDetailModel.getAll();
    }

    async getRoomAmenityDetailById(id) {
        const detail = await this.roomAmenityDetailModel.getById(id);
        if (!detail) {
            throw new Error('Room amenity detail not found');
        }
        return detail;
    }

    async getAmenitiesByRoomNumber(roomNumber) {
        return this.roomAmenityDetailModel.getByRoomNumber(roomNumber);
    }

    async createRoomAmenityDetail(detailData) {
        // Validate data
        if (!detailData.MaTN || !detailData.SoPhong || detailData.SL === undefined) {
            throw new Error('Missing required fields');
        }
        return this.roomAmenityDetailModel.create(detailData);
    }

    async updateRoomAmenityDetail(id, detailData) {
        await this.getRoomAmenityDetailById(id); // Check if exists
        return this.roomAmenityDetailModel.update(id, detailData);
    }

    async deleteRoomAmenityDetail(id) {
        await this.getRoomAmenityDetailById(id); // Check if exists
        return this.roomAmenityDetailModel.softDelete(id);
    }
}

module.exports = RoomAmenityDetailService;