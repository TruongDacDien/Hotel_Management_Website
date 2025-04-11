// services/customerService.js
const { cloudinary } = require('../config/cloudinary');

class CustomerService {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }

    async getAllCustomers() {
        return this.customerModel.getAll();
    }

    async getCustomerById(id) {
        const customer = await this.customerModel.getById(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }

    async getCustomerByCCCD(cccd) {
        const customer = await this.customerModel.getByCCCD(cccd);
        if (!customer) {
            throw new Error('Customer with this CCCD not found');
        }
        return customer;
    }

    async getCustomerByPhone(phone) {
        const customer = await this.customerModel.getByPhone(phone);
        if (!customer) {
            throw new Error('Customer with this phone number not found');
        }
        return customer;
    }

    async createCustomer(customerData) {
        // Validate required fields
        if (!customerData.TenKH || !customerData.CCCD || !customerData.SDT) {
            throw new Error('Missing required fields: TenKH, CCCD, SDT');
        }

        // Check if CCCD already exists
        const existingByCCCD = await this.customerModel.getByCCCD(customerData.CCCD);
        if (existingByCCCD) {
            throw new Error('CCCD already exists');
        }

        // Check if phone already exists
        const existingByPhone = await this.customerModel.getByPhone(customerData.SDT);
        if (existingByPhone) {
            throw new Error('Phone number already exists');
        }

        return this.customerModel.create(customerData);
    }

    async updateCustomer(id, customerData) {
        const existingCustomer = await this.getCustomerById(id);

        // Check if CCCD is being changed to an existing one
        if (customerData.CCCD && customerData.CCCD !== existingCustomer.CCCD) {
            const existingByCCCD = await this.customerModel.getByCCCD(customerData.CCCD);
            if (existingByCCCD) {
                throw new Error('CCCD already exists');
            }
        }

        // Check if phone is being changed to an existing one
        if (customerData.SDT && customerData.SDT !== existingCustomer.SDT) {
            const existingByPhone = await this.customerModel.getByPhone(customerData.SDT);
            if (existingByPhone) {
                throw new Error('Phone number already exists');
            }
        }

        return this.customerModel.update(id, customerData);
    }

    async deleteCustomer(id) {
        await this.getCustomerById(id); // Check if exists
        return this.customerModel.softDelete(id);
    }

    async uploadCCCDImage(customerId, imagePath) {
        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'hotel_management/cccd'
        });

        // Cập nhật URL vào database
        await this.customerModel.update(customerId, {
            CCCDImage: result.secure_url
        });

        return result.secure_url;
    }

    async deleteCCCDImage(customerId) {
        const customer = await this.getCustomerById(customerId);

        if (!customer.CCCDImage) {
            return true;
        }

        // Extract public_id từ URL
        const publicId = customer.CCCDImage
            .split('/')
            .slice(-2)
            .join('/')
            .replace(/\.[^/.]+$/, '');

        // Xóa ảnh từ Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Xóa URL trong database
        await this.customerModel.update(customerId, {
            CCCDImage: null
        });

        return true;
    }
}

module.exports = CustomerService;