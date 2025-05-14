import ServiceType from "../models/ServiceType.js";

class ServiceTypeService {
    static async getAll() {
        return await ServiceType.getAll();
    }

    static async getById(serviceTypeId) {
        const result = await ServiceType.getById(serviceTypeId);
        if (!result) throw new Error('Service type not found');
        return result;
    }

    static async create(data) {
        if (!data.name) {
            throw new Error('Missing name');
        }
        return await ServiceType.create(data);
    }

    static async update(serviceTypeId, data) {
        await this.getById(serviceTypeId); // Check existence
        return await ServiceType.update(serviceTypeId, data);
    }

    static async delete(serviceTypeId) {
        await this.getById(serviceTypeId); // Check existence
        return await ServiceType.delete(serviceTypeId);
    }
}

export default ServiceTypeService;