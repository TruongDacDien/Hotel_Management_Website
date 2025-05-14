import Branch from "../models/Branch.js";

class BranchService {
  static async getAllBranches() {
    return await Branch.getAll();
  }

  static async getBranchById(id) {
    const branch = await Branch.getById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    return branch;
  }

  static async createBranch(branchData) {
    // Validate data
    if (!branchData.TenCN || !branchData.DiaChi) {
      throw new Error('Missing required fields');
    }
    return await Branch.create(branchData);
  }

  static async updateBranch(id, branchData) {
    await this.getBranchById(id); // Check if exists
    return await Branch.update(id, branchData);
  }

  static async deleteBranch(id) {
    await this.getBranchById(id); // Check if exists
    return await Branch.softDelete(id);
  }
}

export default BranchService;