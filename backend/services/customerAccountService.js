class CustomerAccountService {
    constructor(customerAccountModel) {
        this.customerAccountModel = customerAccountModel;
    }

    async getAll() {
        return this.customerAccountModel.getAll();
    }

    async getById(accountId) {
        const result = await this.customerAccountModel.getById(accountId);
        if (!result) throw new Error('Account not found');
        return result;
    }

    async create(data) {
        if (!data.username) {
            throw new Error('Missing username');
        }
        return this.customerAccountModel.create(data);
    }

    async update(accountId, data) {
        await this.getById(accountId); // Check existence
        return this.customerAccountModel.update(accountId, data);
    }

    async delete(accountId) {
        await this.getById(accountId); // Check existence
        return this.customerAccountModel.delete(accountId);
    }
}

module.exports = CustomerAccountService;