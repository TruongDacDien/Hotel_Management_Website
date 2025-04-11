// controllers/branchController.js
class BranchController {
    constructor(branchService) {
      this.branchService = branchService;
    }
  
    async getAllBranches(req, res, next) {
      try {
        const branches = await this.branchService.getAllBranches();
        res.json(branches);
      } catch (err) {
        next(err);
      }
    }
  
    async getBranchById(req, res, next) {
      try {
        const branch = await this.branchService.getBranchById(req.params.id);
        res.json(branch);
      } catch (err) {
        next(err);
      }
    }
  
    async createBranch(req, res, next) {
      try {
        const newBranch = await this.branchService.createBranch(req.body);
        res.status(201).json(newBranch);
      } catch (err) {
        next(err);
      }
    }
  
    async updateBranch(req, res, next) {
      try {
        const updatedBranch = await this.branchService.updateBranch(
          req.params.id,
          req.body
        );
        res.json(updatedBranch);
      } catch (err) {
        next(err);
      }
    }
  
    async deleteBranch(req, res, next) {
      try {
        await this.branchService.deleteBranch(req.params.id);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    }
  }
  
  module.exports = BranchController;