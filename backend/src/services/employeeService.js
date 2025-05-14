import Employee from "../models/Employee.js";

class EmployeeService {
    static async getAll() {
        return await Employee.getAll();
    }

    static async getById(employeeId) {
        const result = await Employee.getById(employeeId);
        if (!result) throw new Error('Employee not found');
        return result;
    }

    static async create(data) {
        if (!data.name || !data.position) {
            throw new Error('Missing name or position');
        }
        return await Employee.create(data);
    }

    static async update(employeeId, data) {
        await this.getById(employeeId); // Check existence
        return await Employee.update(employeeId, data);
    }

    static async delete(employeeId) {
        await this.getById(employeeId); // Check existence
        return await Employee.delete(employeeId);
    }
}

export default EmployeeService;