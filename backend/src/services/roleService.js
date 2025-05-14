import Role from "../models/Role.js";

class RoleService {
    static async getAll() {
        return await Role.getAll();
    }

    static async getById(roleId) {
        const result = await Role.getById(roleId);
        if (!result) throw new Error('Role not found');
        return result;
    }

    static async create(data) {
        if (!data.accountId) {
            throw new Error('Missing accountId');
        }
        return await Role.create(data);
    }

    static async update(roleId, data) {
        await this.getById(roleId); // Check existence
        return await Role.update(roleId, data);
    }

    static async delete(roleId) {
        await this.getById(roleId); // Check existence
        return await Role.delete(roleId);
    }

    static async getAllPermissionOfEmployeeFunction(accountId) {
        return await Role.getAllPermissionOfEmployeeFunction(accountId);
    }
}

export default RoleService;