import NearbyLocation from "../models/NearbyLocation.js";

class NearbyLocationService {
    static async getAllNearbyLocations() {
        return await NearbyLocation.getAll();
    }

    static async getNearbyLocationById(id) {
        const location = await NearbyLocation.getById(id);
        if (!location) {
            throw new Error('Nearby location not found');
        }
        return location;
    }

    static async getLocationsByBranchId(branchId) {
        const locations = await NearbyLocation.getByBranchId(branchId);
        if (!locations || locations.length === 0) {
            throw new Error('No locations found for this branch');
        }
        return locations;
    }

    static async createNearbyLocation(locationData) {
        // Validate required fields
        if (!locationData.MaCN || !locationData.TenDD || !locationData.LoaiDD ||
            !locationData.DiaChi || !locationData.KinhDo || !locationData.ViDo) {
            throw new Error('Missing required fields');
        }

        // Validate rating range (0-10)
        if (locationData.DanhGia && (locationData.DanhGia < 0 || locationData.DanhGia > 10)) {
            throw new Error('Rating must be between 0 and 10');
        }

        return await NearbyLocation.create(locationData);
    }

    static async updateNearbyLocation(id, locationData) {
        await this.getNearbyLocationById(id); // Check if exists

        // Validate rating if provided
        if (locationData.DanhGia && (locationData.DanhGia < 0 || locationData.DanhGia > 10)) {
            throw new Error('Rating must be between 0 and 10');
        }

        return await NearbyLocation.update(id, locationData);
    }

    static async deleteNearbyLocation(id) {
        await this.getNearbyLocationById(id); // Check if exists
        return await NearbyLocation.delete(id);
    }

    static async fetchAndSaveNearbyLocations(branchId, radius, type, limit) {
        // Validate required fields
        if (!branchId || !radius || !type || !limit) {
            throw new Error('Missing required fields: branchId, radius, type, or limit');
        }

        // Validate type
        const validTypes = [
            'restaurant', 'hotel', 'cafe', 'bar',
            'amusement_park', 'aquarium', 'bowling_alley', 'casino',
            'movie_theater', 'museum', 'night_club', 'park',
            'tourist_attraction', 'zoo', 'lodging', 'rv_park',
            'campground', 'gym', 'stadium', 'spa'
        ];
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid type: ${type}. Supported types: ${validTypes.join(', ')}`);
        }

        // Validate limit
        if (limit < 1 || limit > 20) {
            throw new Error('Limit must be between 1 and 20');
        }

        return await NearbyLocation.fetchAndSaveNearbyLocations(branchId, radius, type, limit);
    }
}

export default NearbyLocationService;