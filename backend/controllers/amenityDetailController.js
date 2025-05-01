class AmenityDetailController {
    constructor(amenityDetailService) {
        this.amenityDetailService = amenityDetailService;

        // Bind all methods
        this.getAllAmenityDetails = this.getAllAmenityDetails.bind(this);
        this.getAmenityDetailById = this.getAmenityDetailById.bind(this);
        this.getAmenitiesByRoomType = this.getAmenitiesByRoomType.bind(this);
        this.createAmenityDetail = this.createAmenityDetail.bind(this);
        this.updateAmenityDetail = this.updateAmenityDetail.bind(this);
        this.deleteAmenityDetail = this.deleteAmenityDetail.bind(this);
    }

    async getAllAmenityDetails(req, res, next) {
        try {
            const details = await this.amenityDetailService.getAllAmenityDetails();
            res.json(details);
        } catch (err) {
            next(err);
        }
    }

    async getAmenityDetailById(req, res, next) {
        try {
            const detail = await this.amenityDetailService.getAmenityDetailById(req.params.id);
            res.json(detail);
        } catch (err) {
            next(err);
        }
    }

    async getAmenitiesByRoomType(req, res, next) {
        try {
            const amenities = await this.amenityDetailService.getAmenitiesByRoomType(req.params.roomTypeId);
            res.json(amenities);
        } catch (err) {
            next(err);
        }
    }

    async createAmenityDetail(req, res, next) {
        try {
            const newDetail = await this.amenityDetailService.createAmenityDetail(req.body);
            res.status(201).json(newDetail);
        } catch (err) {
            next(err);
        }
    }

    async updateAmenityDetail(req, res, next) {
        try {
            const updatedDetail = await this.amenityDetailService.updateAmenityDetail(
                req.params.id,
                req.body
            );
            res.json(updatedDetail);
        } catch (err) {
            next(err);
        }
    }

    async deleteAmenityDetail(req, res, next) {
        try {
            await this.amenityDetailService.deleteAmenityDetail(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AmenityDetailController;