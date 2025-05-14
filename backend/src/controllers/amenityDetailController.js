import expressAsyncHandler from "express-async-handler";
import AmenityDetailService from "../services/AmenityDetailService.js";

class AmenityDetailController {
    getAllAmenityDetails = expressAsyncHandler(async (req, res) => {
        const details = await AmenityDetailService.getAllAmenityDetails();
        res.json(details);
    });

    getAmenityDetailById = expressAsyncHandler(async (req, res) => {
        const detail = await AmenityDetailService.getAmenityDetailById(req.params.id);
        res.json(detail);
    });

    getAmenitiesByRoomType = expressAsyncHandler(async (req, res) => {
        const amenities = await AmenityDetailService.getAmenitiesByRoomType(req.params.roomTypeId);
        res.json(amenities);
    });

    createAmenityDetail = expressAsyncHandler(async (req, res) => {
        const newDetail = await AmenityDetailService.createAmenityDetail(req.body);
        res.status(201).json(newDetail);
    });

    updateAmenityDetail = expressAsyncHandler(async (req, res) => {
        const updatedDetail = await AmenityDetailService.updateAmenityDetail(req.params.id, req.body);
        res.json(updatedDetail);
    });

    deleteAmenityDetail = expressAsyncHandler(async (req, res) => {
        await AmenityDetailService.deleteAmenityDetail(req.params.id);
        res.status(204).end();
    });
}

export default new AmenityDetailController();
