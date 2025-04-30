class EmployeeService {
    constructor(employeeModel) {
        this.employeeModel = employeeModel;
    }

    async getAll() {
        return this.employeeModel.getAll();
    }

    async getById(employeeId) {
        const result = await this.employeeModel.getById(employeeId);
        if (!result) throw new Error('Employee not found');
        return result;
    }

    async create(data) {
        if (!data.name || !data.position) {
            throw new Error('Missing name or position');
        }
        return this.employeeModel.create(data);
    }

    async update(employeeId, data) {
        await this.getById(employeeId); // Check existence
        return this.employeeModel.update(employeeId, data);
    }

    async delete(employeeId) {
        await this.getById(employeeId); // Check existence
        return this.employeeModel.delete(employeeId);
    }
}

module.exports = EmployeeService;