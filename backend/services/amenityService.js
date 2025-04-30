class AmenityService {
    constructor(amenityModel) {
        this.amenityModel = amenityModel;
    }

    async getAll() {
        return this.amenityModel.getAll();
    }

    async getById(amenityId) {
        const result = await this.amenityModel.getById(amenityId);
        if (!result) throw new Error('Amenity not found');
        return result;
    }

    async create(data) {
        if (!data.name) {
            throw new Error('Missing amenity name');
        }
        return this.amenityModel.create(data);
    }

    async update(amenityId, data) {
        await this.getById(amenityId); // Check existence
        return this.amenityModel.update(amenityId, data);
    }

    async delete(amenityId) {
        await this.getById(amenityId); // Check existence
        return this.amenityModel.delete(amenityId);
    }
}

module.exports = AmenityService;