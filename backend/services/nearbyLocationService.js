class NearbyLocationService {
    constructor(nearbyLocationModel) {
        this.nearbyLocationModel = nearbyLocationModel;
    }

    async getAllNearbyLocations() {
        return this.nearbyLocationModel.getAll();
    }

    async getNearbyLocationById(id) {
        const location = await this.nearbyLocationModel.getById(id);
        if (!location) {
            throw new Error('Nearby location not found');
        }
        return location;
    }

    async getLocationsByBranchId(branchId) {
        const locations = await this.nearbyLocationModel.getByBranchId(branchId);
        if (!locations || locations.length === 0) {
            throw new Error('No locations found for this branch');
        }
        return locations;
    }

    async createNearbyLocation(locationData) {
        // Validate required fields
        if (!locationData.MaCN || !locationData.TenDD || !locationData.LoaiDD ||
            !locationData.DiaChi || !locationData.KinhDo || !locationData.ViDo) {
            throw new Error('Missing required fields');
        }

        // Validate rating range (0-10)
        if (locationData.DanhGia && (locationData.DanhGia < 0 || locationData.DanhGia > 10)) {
            throw new Error('Rating must be between 0 and 10');
        }

        return this.nearbyLocationModel.create(locationData);
    }

    async updateNearbyLocation(id, locationData) {
        await this.getNearbyLocationById(id); // Check if exists

        // Validate rating if provided
        if (locationData.DanhGia && (locationData.DanhGia < 0 || locationData.DanhGia > 10)) {
            throw new Error('Rating must be between 0 and 10');
        }

        return this.nearbyLocationModel.update(id, locationData);
    }

    async deleteNearbyLocation(id) {
        await this.getNearbyLocationById(id); // Check if exists
        return this.nearbyLocationModel.delete(id);
    }

    async fetchAndSaveNearbyLocations(branchId, radius, type, limit) {
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

        return await this.nearbyLocationModel.fetchAndSaveNearbyLocations(branchId, radius, type, limit);
    }
}

module.exports = NearbyLocationService;