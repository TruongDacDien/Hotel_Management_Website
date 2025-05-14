import expressAsyncHandler from "express-async-handler";
import BranchService from "../services/branchService.js";

class BranchController {
    getAllBranches = expressAsyncHandler(async (req, res) => {
        const branches = await BranchService.getAllBranches();
        res.json(branches);
    });

    getBranchById = expressAsyncHandler(async (req, res) => {
        const branch = await BranchService.getBranchById(req.params.id);
        res.json(branch);
    });

    createBranch = expressAsyncHandler(async (req, res) => {
        const newBranch = await BranchService.createBranch(req.body);
        res.status(201).json(newBranch);
    });

    updateBranch = expressAsyncHandler(async (req, res) => {
        const updatedBranch = await BranchService.updateBranch(req.params.id, req.body);
        res.json(updatedBranch);
    });

    deleteBranch = expressAsyncHandler(async (req, res) => {
        await BranchService.deleteBranch(req.params.id);
        res.status(204).end();
    });
}

export default new BranchController();