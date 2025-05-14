import expressAsyncHandler from "express-async-handler";
import RoleService from "../services/roleService.js";

class RoleController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await RoleService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { roleId } = req.params;
        const item = await RoleService.getById(roleId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await RoleService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { roleId } = req.params;
        const updated = await RoleService.update(roleId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { roleId } = req.params;
        await RoleService.delete(roleId);
        res.status(204).end();
    });
}

export default new RoleController();