import CustomerAccount from "../models/CustomerAccount.js";

class CustomerAccountService {
    static async getAll() {
        return await CustomerAccount.getAll();
    }

    static async getById(accountId) {
        const result = await CustomerAccount.getById(accountId);
        if (!result) throw new Error('Account not found');
        return result;
    }

    static async create(data) {
        if (!data.username) {
            throw new Error('Missing username');
        }
        return await CustomerAccount.create(data);
    }

    static async update(accountId, data) {
        await this.getById(accountId); // Check existence
        return await CustomerAccount.update(accountId, data);
    }

    static async delete(accountId) {
        await this.getById(accountId); // Check existence
        return await CustomerAccount.delete(accountId);
    }

    static async findById(accountId) {
        return await CustomerAccount.findById(accountId);
    }

    static async findUserByPhone(phone) {
        return await CustomerAccount.findUserByPhone(phone);
    }

    static async findUserByEmail(email) {
        return await CustomerAccount.findUserByEmail(email);
    }

    static async findCustomerByIdentifier(identifier) {
        return await CustomerAccount.findCustomerByIdentifier(identifier);
    }
}

export default CustomerAccountService;