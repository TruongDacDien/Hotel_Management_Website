import expressAsyncHandler from "express-async-handler";
import EmployeeService from "../services/employeeService.js";

class EmployeeController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await EmployeeService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { employeeId } = req.params;
        const item = await EmployeeService.getById(employeeId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await EmployeeService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { employeeId } = req.params;
        const updated = await EmployeeService.update(employeeId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { employeeId } = req.params;
        await EmployeeService.delete(employeeId);
        res.status(204).end();
    });
}

export default new EmployeeController();