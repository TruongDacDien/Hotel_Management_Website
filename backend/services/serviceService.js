class ServiceService {
    constructor(serviceModel) {
        this.serviceModel = serviceModel;
    }

    async getAllServices(includeDeleted = false) {
        return this.serviceModel.getAll(includeDeleted);
    }

    async getServiceById(id) {
        const service = await this.serviceModel.getById(id);
        if (!service) {
            throw new Error('Service not found');
        }
        return service;
    }

    async getServicesByCategory(categoryId) {
        const services = await this.serviceModel.getByCategory(categoryId);
        if (!services || services.length === 0) {
            throw new Error('No services found for this category');
        }
        return services;
    }

    async createService(serviceData) {
        // Validate required fields
        if (!serviceData.TenDV || !serviceData.MaLoaiDV || serviceData.Gia === undefined) {
            throw new Error('Missing required fields: TenDV, MaLoaiDV, Gia');
        }

        // Validate price is non-negative
        if (serviceData.Gia < 0) {
            throw new Error('Price cannot be negative');
        }

        return this.serviceModel.create(serviceData);
    }

    async updateService(id, serviceData) {
        await this.getServiceById(id); // Check if exists

        // Validate price if provided
        if (serviceData.Gia !== undefined && serviceData.Gia < 0) {
            throw new Error('Price cannot be negative');
        }

        return this.serviceModel.update(id, serviceData);
    }

    async deleteService(id) {
        await this.getServiceById(id); // Check if exists
        return this.serviceModel.softDelete(id);
    }

    async restoreService(id) {
        const service = await this.serviceModel.getById(id, true);
        if (!service) {
            throw new Error('Service not found');
        }
        return this.serviceModel.restore(id);
    }
}

module.exports = ServiceService;