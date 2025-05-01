class AmenityDetailService {
    constructor(amenityDetailModel) {
        this.amenityDetailModel = amenityDetailModel;
    }

    async getAllAmenityDetails() {
        return this.amenityDetailModel.getAll();
    }

    async getAmenityDetailById(id) {
        const detail = await this.amenityDetailModel.getById(id);
        if (!detail) {
            throw new Error('Amenity detail not found');
        }
        return detail;
    }

    async getAmenitiesByRoomType(roomTypeId) {
        return this.amenityDetailModel.getByRoomType(roomTypeId);
    }

    async createAmenityDetail(detailData) {
        // Validate data
        if (!detailData.MaTN || !detailData.MaLoaiPhong || detailData.SL === undefined) {
            throw new Error('Missing required fields');
        }
        return this.amenityDetailModel.create(detailData);
    }

    async updateAmenityDetail(id, detailData) {
        await this.getAmenityDetailById(id); // Check if exists
        return this.amenityDetailModel.update(id, detailData);
    }

    async deleteAmenityDetail(id) {
        await this.getAmenityDetailById(id); // Check if exists
        return this.amenityDetailModel.softDelete(id);
    }
}

module.exports = AmenityDetailService;