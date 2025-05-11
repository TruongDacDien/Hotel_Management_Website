class NearbyLocationController {
    constructor(nearbyLocationService) {
        this.nearbyLocationService = nearbyLocationService;
        
        // Bind all methods
        this.getAllNearbyLocations = this.getAllNearbyLocations.bind(this);
        this.getNearbyLocationById = this.getNearbyLocationById.bind(this);
        this.getLocationsByBranchId = this.getLocationsByBranchId.bind(this);
        this.createNearbyLocation = this.createNearbyLocation.bind(this);
        this.updateNearbyLocation = this.updateNearbyLocation.bind(this);
        this.deleteNearbyLocation = this.deleteNearbyLocation.bind(this);
        this.fetchAndSaveNearbyLocations = this.fetchAndSaveNearbyLocations.bind(this);
    }

    async getAllNearbyLocations(req, res, next) {
        try {
            const locations = await this.nearbyLocationService.getAllNearbyLocations();
            res.json(locations);
        } catch (err) {
            next(err);
        }
    }

    async getNearbyLocationById(req, res, next) {
        try {
            const location = await this.nearbyLocationService.getNearbyLocationById(req.params.id);
            res.json(location);
        } catch (err) {
            next(err);
        }
    }

    async getLocationsByBranchId(req, res, next) {
        try {
            const locations = await this.nearbyLocationService.getLocationsByBranchId(req.params.branchId);
            res.json(locations);
        } catch (err) {
            next(err);
        }
    }

    async createNearbyLocation(req, res, next) {
        try {
            const newLocation = await this.nearbyLocationService.createNearbyLocation(req.body);
            res.status(201).json(newLocation);
        } catch (err) {
            next(err);
        }
    }

    async updateNearbyLocation(req, res, next) {
        try {
            const updatedLocation = await this.nearbyLocationService.updateNearbyLocation(
                req.params.id,
                req.body
            );
            res.json(updatedLocation);
        } catch (err) {
            next(err);
        }
    }

    async deleteNearbyLocation(req, res, next) {
        try {
            await this.nearbyLocationService.deleteNearbyLocation(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    } 

    async fetchAndSaveNearbyLocations(req, res, next) {
        try {
            const { branchId, radius, type, limit } = req.body;
            const nearbyLocation = await this.nearbyLocationService.fetchAndSaveNearbyLocations(branchId, radius, type, limit);
            res.status(201).json(nearbyLocation);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = NearbyLocationController;