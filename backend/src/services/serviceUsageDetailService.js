import ServiceUsageDetail from "../models/ServiceUsageDetail.js";

class ServiceUsageDetailService {
  static async getAll() {
    return await ServiceUsageDetail.getAll();
  }

  static async getById(bookingId, serviceId) {
    const result = await ServiceUsageDetail.getById(bookingId, serviceId);
    if (!result) throw new Error('Service usage detail not found');
    return result;
  }

  static async create(data) {
    if (!data.bookingId || !data.serviceId || data.quantity == null) {
      throw new Error('Missing required fields');
    }
    return await ServiceUsageDetail.create(data);
  }

  static async update(bookingId, serviceId, data) {
    await this.getById(bookingId, serviceId);
    return await ServiceUsageDetail.update(bookingId, serviceId, data);
  }

  static async delete(bookingId, serviceId) {
    await this.getById(bookingId, serviceId);
    return await ServiceUsageDetail.delete(bookingId, serviceId);
  }
}

export default ServiceUsageDetailService;