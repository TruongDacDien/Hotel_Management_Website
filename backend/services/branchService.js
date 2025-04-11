// services/branchService.js
class BranchService {
    constructor(branchModel) {
      this.branchModel = branchModel;
    }
  
    async getAllBranches() {
      return this.branchModel.getAll();
    }
  
    async getBranchById(id) {
      const branch = await this.branchModel.getById(id);
      if (!branch) {
        throw new Error('Branch not found');
      }
      return branch;
    }
  
    async createBranch(branchData) {
      // Validate data
      if (!branchData.TenCN || !branchData.DiaChi) {
        throw new Error('Missing required fields');
      }
      return this.branchModel.create(branchData);
    }
  
    async updateBranch(id, branchData) {
      await this.getBranchById(id); // Check if exists
      return this.branchModel.update(id, branchData);
    }
  
    async deleteBranch(id) {
      await this.getBranchById(id); // Check if exists
      return this.branchModel.softDelete(id);
    }
  }
  
  module.exports = BranchService;