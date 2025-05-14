import EmployeeActivity from '../models/EmployeeActivity.js';

class EmployeeActivityService {
    static async getAll() {
        return await EmployeeActivity.getAll();
    }

    static async getById(activityId) {
        const result = await EmployeeActivity.getById(activityId);
        if (!result) throw new Error('Activity not found');
        return result;
    }

    static async create(data) {
        if (!data.employeeId || !data.action) {
            throw new Error('Missing employeeId or action');
        }
        return await EmployeeActivity.create(data);
    }

    static async update(activityId, data) {
        await this.getById(activityId); // Check existence
        return await EmployeeActivity.update(activityId, data);
    }

    static async delete(activityId) {
        await this.getById(activityId); // Check existence
        return await EmployeeActivity.delete(activityId);
    }
}

export default EmployeeActivityService;