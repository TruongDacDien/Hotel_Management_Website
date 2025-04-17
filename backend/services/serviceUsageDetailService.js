class ServiceUsageDetailService {
    constructor(model) {
      this.model = model;
    }
  
    async getAll() {
      return this.model.getAll();
    }
  
    async getById(bookingId, serviceId) {
      const result = await this.model.getById(bookingId, serviceId);
      if (!result) throw new Error('Service usage detail not found');
      return result;
    }
  
    async create(data) {
      if (!data.bookingId || !data.serviceId || data.quantity == null) {
        throw new Error('Missing required fields');
      }
      return this.model.create(data);
    }
  
    async update(bookingId, serviceId, data) {
      await this.getById(bookingId, serviceId);
      return this.model.update(bookingId, serviceId, data);
    }
  
    async delete(bookingId, serviceId) {
      await this.getById(bookingId, serviceId);
      return this.model.delete(bookingId, serviceId);
    }
  }
  
  module.exports = ServiceUsageDetailService;
  