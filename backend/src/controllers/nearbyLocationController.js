import expressAsyncHandler from "express-async-handler";
import NearbyLocationService from "../services/nearbyLocationService.js";

class NearbyLocationController {
    getAllNearbyLocations = expressAsyncHandler(async (req, res) => {
        const locations = await NearbyLocationService.getAllNearbyLocations();
        res.json(locations);
    });

    getNearbyLocationById = expressAsyncHandler(async (req, res) => {
        const location = await NearbyLocationService.getNearbyLocationById(req.params.id);
        res.json(location);
    });

    getLocationsByBranchId = expressAsyncHandler(async (req, res) => {
        const locations = await NearbyLocationService.getLocationsByBranchId(req.params.branchId);
        res.json(locations);
    });

    createNearbyLocation = expressAsyncHandler(async (req, res) => {
        const newLocation = await NearbyLocationService.createNearbyLocation(req.body);
        res.status(201).json(newLocation);
    });

    updateNearbyLocation = expressAsyncHandler(async (req, res) => {
        const updatedLocation = await NearbyLocationService.updateNearbyLocation(req.params.id, req.body);
        res.json(updatedLocation);
    });

    deleteNearbyLocation = expressAsyncHandler(async (req, res) => {
        await NearbyLocationService.deleteNearbyLocation(req.params.id);
        res.status(204).end();
    });

    fetchAndSaveNearbyLocations = expressAsyncHandler(async (req, res) => {
        const { branchId, radius, type, limit } = req.body;
        const nearbyLocation = await NearbyLocationService.fetchAndSaveNearbyLocations(branchId, radius, type, limit);
        res.status(201).json(nearbyLocation);
    });
}

export default new NearbyLocationController();