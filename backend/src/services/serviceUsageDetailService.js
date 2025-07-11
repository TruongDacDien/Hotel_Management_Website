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
    if (!data.customerId || !data.serviceId || data.quantity == null || !data.offeredDate || !data.totalMoney) {
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

   static async updatePaymentStatus(serviceUsageDetailId, status, isPaid, paymentMethod) {
    if (!serviceUsageDetailId || !status || isPaid === null || !paymentMethod) {
      throw new Error('Missing data');
    }
    return await ServiceUsageDetail.updatePaymentStatus(serviceUsageDetailId, status, isPaid, paymentMethod);
  }

  static async cancelServiceUsageDetail(serviceUsageDetailId){
    if(!serviceUsageDetailId){
      throw new Error('Missing data');
    }
    return await ServiceUsageDetail.cancelServiceUsageDetail(serviceUsageDetailId);
  }
}

export default ServiceUsageDetailService;