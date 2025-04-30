class EmployeeAccountService {
    constructor(employeeAccountModel) {
        this.employeeAccountModel = employeeAccountModel;
    }

    async getAll() {
        return this.employeeAccountModel.getAll();
    }

    async getById(accountId) {
        const result = await this.employeeAccountModel.getById(accountId);
        if (!result) throw new Error('Account not found');
        return result;
    }

    async create(data) {
        if (!data.username) {
            throw new Error('Missing username');
        }
        return this.employeeAccountModel.create(data);
    }

    async update(accountId, data) {
        await this.getById(accountId); // Check existence
        return this.employeeAccountModel.update(accountId, data);
    }

    async delete(accountId) {
        await this.getById(accountId); // Check existence
        return this.employeeAccountModel.delete(accountId);
    }
}

module.exports = EmployeeAccountService;