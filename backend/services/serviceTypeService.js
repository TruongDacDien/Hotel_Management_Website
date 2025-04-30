class ServiceTypeService {
    constructor(serviceTypeModel) {
        this.serviceTypeModel = serviceTypeModel;
    }

    async getAll() {
        return this.serviceTypeModel.getAll();
    }

    async getById(serviceTypeId) {
        const result = await this.serviceTypeModel.getById(serviceTypeId);
        if (!result) throw new Error('Service type not found');
        return result;
    }

    async create(data) {
        if (!data.name) {
            throw new Error('Missing name');
        }
        return this.serviceTypeModel.create(data);
    }

    async update(serviceTypeId, data) {
        await this.getById(serviceTypeId); // Check existence
        return this.serviceTypeModel.update(serviceTypeId, data);
    }

    async delete(serviceTypeId) {
        await this.getById(serviceTypeId); // Check existence
        return this.serviceTypeModel.delete(serviceTypeId);
    }
}

module.exports = ServiceTypeService;    