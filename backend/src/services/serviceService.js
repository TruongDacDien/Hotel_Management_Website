import Service from "../models/Service.js";

class ServiceService {
    static async getAllServices(includeDeleted = false) {
        return await Service.getAll(includeDeleted);
    }

    static async getServiceById(id) {
        const service = await Service.getById(id);
        if (!service) {
            throw new Error('Service not found');
        }
        return service;
    }

    static async getServicesByCategory(categoryId) {
        const services = await Service.getByCategory(categoryId);
        if (!services || services.length === 0) {
            throw new Error('No services found for this category');
        }
        return services;
    }

    static async createService(serviceData) {
        // Validate required fields
        if (!serviceData.TenDV || !serviceData.MaLoaiDV || serviceData.Gia === undefined) {
            throw new Error('Missing required fields: TenDV, MaLoaiDV, Gia');
        }

        // Validate price is non-negative
        if (serviceData.Gia < 0) {
            throw new Error('Price cannot be negative');
        }

        return await Service.create(serviceData);
    }

    static async updateService(id, serviceData) {
        await this.getServiceById(id); // Check if exists

        // Validate price if provided
        if (serviceData.Gia !== undefined && serviceData.Gia < 0) {
            throw new Error('Price cannot be negative');
        }

        return await Service.update(id, serviceData);
    }

    static async deleteService(id) {
        await this.getServiceById(id); // Check if exists
        return await Service.softDelete(id);
    }

    static async restoreService(id) {
        const service = await Service.getById(id, true);
        if (!service) {
            throw new Error('Service not found');
        }
        return await Service.restore(id);
    }

    static async findByIdAndUpdateQuantity(id, quantity) {
        return await Service.findByIdAndUpdateQuantity(id, quantity);
    }
}

export default ServiceService;