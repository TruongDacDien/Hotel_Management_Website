import expressAsyncHandler from "express-async-handler";
import CustomerAccountService from "../services/customerAccountService.js";

class CustomerAccountController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await CustomerAccountService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const item = await CustomerAccountService.getById(accountId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await CustomerAccountService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const updated = await CustomerAccountService.update(accountId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { accountId } = req.params;
        await CustomerAccountService.delete(accountId);
        res.status(204).end();
    });
}

export default new CustomerAccountController();