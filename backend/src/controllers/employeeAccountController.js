import expressAsyncHandler from "express-async-handler";
import EmployeeAccountService from "../services/employeeAccountService.js";

class EmployeeAccountController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await EmployeeAccountService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const item = await EmployeeAccountService.getById(accountId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await EmployeeAccountService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const updated = await EmployeeAccountService.update(accountId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        await EmployeeAccountService.delete(accountId);
        res.status(204).end();
    });
}

export default new EmployeeAccountController();