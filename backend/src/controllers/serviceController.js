import expressAsyncHandler from "express-async-handler";
import ServiceService from "../services/serviceService.js";

class ServiceController {
    getAllServices = expressAsyncHandler(async (req, res) => {
        const includeDeleted = req.query.includeDeleted === 'true';
        const services = await ServiceService.getAllServices(includeDeleted);
        res.json(services);
    });

    getServiceById = expressAsyncHandler(async (req, res) => {
        const service = await ServiceService.getServiceById(req.params.id);
        res.json(service);
    });

    getServicesByCategory = expressAsyncHandler(async (req, res) => {
        const services = await ServiceService.getServicesByCategory(req.params.categoryId);
        res.json(services);
    });

    createService = expressAsyncHandler(async (req, res) => {
        const newService = await ServiceService.createService(req.body);
        res.status(201).json(newService);
    });

    updateService = expressAsyncHandler(async (req, res) => {
        const updatedService = await ServiceService.updateService(req.params.id, req.body);
        res.json(updatedService);
    });

    deleteService = expressAsyncHandler(async (req, res) => {
        await ServiceService.deleteService(req.params.id);
        res.status(204).end();
    });

    restoreService = expressAsyncHandler(async (req, res) => {
        await ServiceService.restoreService(req.params.id);
        res.status(200).json({ message: 'Service restored successfully' });
    });
}

export default new ServiceController();