class RoomAmenityDetailController {
    constructor(roomAmenityDetailService) {
        this.roomAmenityDetailService = roomAmenityDetailService;
        
        // Bind all methods
        this.getAllRoomAmenityDetails = this.getAllRoomAmenityDetails.bind(this);
        this.getRoomAmenityDetailById = this.getRoomAmenityDetailById.bind(this);
        this.getAmenitiesByRoomNumber = this.getAmenitiesByRoomNumber.bind(this);
        this.createRoomAmenityDetail = this.createRoomAmenityDetail.bind(this);
        this.updateRoomAmenityDetail = this.updateRoomAmenityDetail.bind(this);
        this.deleteRoomAmenityDetail = this.deleteRoomAmenityDetail.bind(this);
    }

    async getAllRoomAmenityDetails(req, res, next) {
        try {
            const details = await this.roomAmenityDetailService.getAllRoomAmenityDetails();
            res.json(details);
        } catch (err) {
            next(err);
        }
    }

    async getRoomAmenityDetailById(req, res, next) {
        try {
            const detail = await this.roomAmenityDetailService.getRoomAmenityDetailById(req.params.id);
            res.json(detail);
        } catch (err) {
            next(err);
        }
    }

    async getAmenitiesByRoomNumber(req, res, next) {
        try {
            const amenities = await this.roomAmenityDetailService.getAmenitiesByRoomNumber(req.params.roomNumber);
            res.json(amenities);
        } catch (err) {
            next(err);
        }
    }

    async createRoomAmenityDetail(req, res, next) {
        try {
            const newDetail = await this.roomAmenityDetailService.createRoomAmenityDetail(req.body);
            res.status(201).json(newDetail);
        } catch (err) {
            next(err);
        }
    }

    async updateRoomAmenityDetail(req, res, next) {
        try {
            const updatedDetail = await this.roomAmenityDetailService.updateRoomAmenityDetail(
                req.params.id,
                req.body
            );
            res.json(updatedDetail);
        } catch (err) {
            next(err);
        }
    }

    async deleteRoomAmenityDetail(req, res, next) {
        try {
            await this.roomAmenityDetailService.deleteRoomAmenityDetail(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = RoomAmenityDetailController;