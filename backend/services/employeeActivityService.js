class EmployeeActivityService {
    constructor(employeeActivityModel) {
        this.employeeActivityModel = employeeActivityModel;
    }

    async getAll() {
        return this.employeeActivityModel.getAll();
    }

    async getById(activityId) {
        const result = await this.employeeActivityModel.getById(activityId);
        if (!result) throw new Error('Activity not found');
        return result;
    }

    async create(data) {
        if (!data.employeeId || !data.action) {
            throw new Error('Missing employeeId or action');
        }
        return this.employeeActivityModel.create(data);
    }

    async update(activityId, data) {
        await this.getById(activityId); // Check existence
        return this.employeeActivityModel.update(activityId, data);
    }

    async delete(activityId) {
        await this.getById(activityId); // Check existence
        return this.employeeActivityModel.delete(activityId);
    }
}

module.exports = EmployeeActivityService;