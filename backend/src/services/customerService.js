import Customer from '../models/Customer.js';
import { handleDestroyCloudinary } from "../utils/cloudinary.js";

class CustomerService {
    static async getAllCustomers() {
        return await Customer.getAll();
    }

    static async getCustomerById(id) {
        const customer = await Customer.getById(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }

    static async getCustomerByCCCD(cccd) {
        const customer = await Customer.getByCCCD(cccd);
        if (!customer) {
            throw new Error('Customer with this CCCD not found');
        }
        return customer;
    }

    static async getCustomerByPhone(phone) {
        const customer = await Customer.getByPhone(phone);
        if (!customer) {
            throw new Error('Customer with this phone number not found');
        }
        return customer;
    }

    static async createCustomer(customerData) {
        // Validate required fields
        if (!customerData.TenKH || !customerData.CCCD || !customerData.SDT) {
            throw new Error('Missing required fields: TenKH, CCCD, SDT');
        }

        // Check if CCCD already exists
        const existingByCCCD = await Customer.getByCCCD(customerData.CCCD);
        if (existingByCCCD) {
            throw new Error('CCCD already exists');
        }

        // Check if phone already exists
        const existingByPhone = await Customer.getByPhone(customerData.SDT);
        if (existingByPhone) {
            throw new Error('Phone number already exists');
        }

        return await Customer.create(customerData);
    }

    static async updateCustomer(id, customerData) {
        const existingCustomer = await this.getCustomerById(id);

        // Check if CCCD is being changed to an existing one
        if (customerData.CCCD && customerData.CCCD !== existingCustomer.CCCD) {
            const existingByCCCD = await Customer.getByCCCD(customerData.CCCD);
            if (existingByCCCD) {
                throw new Error('CCCD already exists');
            }
        }

        // Check if phone is being changed to an existing one
        if (customerData.SDT && customerData.SDT !== existingCustomer.SDT) {
            const existingByPhone = await Customer.getByPhone(customerData.SDT);
            if (existingByPhone) {
                throw new Error('Phone number already exists');
            }
        }

        return await Customer.update(id, customerData);
    }

    static async deleteCustomer(id) {
        await this.getCustomerById(id); // Check if exists
        return await Customer.softDelete(id);
    }

    static async uploadCCCDImage(customerId, imagePath) {
        // Upload image to Cloudinary
        const result = await handleDestroyCloudinary.upload(imagePath, {
            folder: 'hotel_management/cccd'
        });

        // Update URL in database
        await Customer.update(customerId, {
            CCCDImage: result.secure_url
        });

        return result.secure_url;
    }

    static async deleteCCCDImage(customerId) {
        const customer = await this.getCustomerById(customerId);

        if (!customer.CCCDImage) {
            return true;
        }

        // Extract public_id from URL
        const publicId = customer.CCCDImage
            .split('/')
            .slice(-2)
            .join('/')
            .replace(/\.[^/.]+$/, '');

        // Delete image from Cloudinary
        await handleDestroyCloudinary.destroy(publicId);

        // Remove URL from database
        await Customer.update(customerId, {
            CCCDImage: null
        });

        return true;
    }
}

export default CustomerService;