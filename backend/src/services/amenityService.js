import Amenity from "../models/Amenity.js";

class AmenityService {
    static async getAll() {
        return await Amenity.getAll();
    }

    static async getById(amenityId) {
        const result = await Amenity.getById(amenityId);
        if (!result) throw new Error('Amenity not found');
        return result;
    }

    static async create(data) {
        if (!data.name) {
            throw new Error('Missing amenity name');
        }
        return await Amenity.create(data);
    }

    static async update(amenityId, data) {
        await this.getById(amenityId); // Check existence
        return await Amenity.update(amenityId, data);
    }

    static async delete(amenityId) {
        await this.getById(amenityId); // Check existence
        return await Amenity.delete(amenityId);
    }
}

export default AmenityService;