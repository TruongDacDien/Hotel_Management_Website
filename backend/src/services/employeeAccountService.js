import EmployeeAccount from '../models/EmployeeAccount.js';

class EmployeeAccountService {
    static async getAll() {
        return await EmployeeAccount.getAll();
    }

    static async getById(accountId) {
        const result = await EmployeeAccount.getById(accountId);
        if (!result) throw new Error('Account not found');
        return result;
    }

    static async create(data) {
        if (!data.username) {
            throw new Error('Missing username');
        }
        return await EmployeeAccount.create(data);
    }

    static async update(accountId, data) {
        await this.getById(accountId); // Check existence
        return await EmployeeAccount.update(accountId, data);
    }

    static async delete(accountId) {
        await this.getById(accountId); // Check existence
        return await EmployeeAccount.delete(accountId);
    }

    static async findById(accountId) {
        return await EmployeeAccount.findById(accountId);
    }

    static async findEmployeeByPhone(phone) {
        return await EmployeeAccount.findByPhone(phone);
    }

    static async findEmployeeByEmail(email) {
        return await EmployeeAccount.findByEmail(email);
    }

    static async findEmployeeByIdentifier(identifier) {
        return await EmployeeAccount.findEmployeeByIdentifier(identifier);
    }
}

export default EmployeeAccountService;