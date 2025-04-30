class RoleService {
    constructor(roleModel) {
        this.roleModel = roleModel;
    }

    async getAll() {
        return this.roleModel.getAll();
    }

    async getById(roleId) {
        const result = await this.roleModel.getById(roleId);
        if (!result) throw new Error('Role not found');
        return result;
    }

    async create(data) {
        if (!data.accountId) {
            throw new Error('Missing accountId');
        }
        return this.roleModel.create(data);
    }

    async update(roleId, data) {
        await this.getById(roleId); // Check existence
        return this.roleModel.update(roleId, data);
    }

    async delete(roleId) {
        await this.getById(roleId); // Check existence
        return this.roleModel.delete(roleId);
    }
}

module.exports = RoleService;