import expressAsyncHandler from "express-async-handler";
import EmployeeActivityService from "../services/employeeActivityService.js";

class EmployeeActivityController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await EmployeeActivityService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { activityId } = req.params;
        const item = await EmployeeActivityService.getById(activityId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await EmployeeActivityService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { activityId } = req.params;
        const updated = await EmployeeActivityService.update(activityId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { activityId } = req.params;
        await EmployeeActivityService.delete(activityId);
        res.status(204).end();
    });
}

export default new EmployeeActivityController();