// controllers/customerController.js
const uploadImage = require('../middlewares/uploadImage');

class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;

        // Bind all methods
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.getCustomerById = this.getCustomerById.bind(this);
        this.getCustomerByCCCD = this.getCustomerByCCCD.bind(this);
        this.getCustomerByPhone = this.getCustomerByPhone.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.uploadCCCDImage = this.uploadCCCDImage.bind(this);
        this.deleteCCCDImage = this.deleteCCCDImage.bind(this);
    }

    async getAllCustomers(req, res, next) {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.json(customers);
        } catch (err) {
            next(err);
        }
    }

    async getCustomerById(req, res, next) {
        try {
            const customer = await this.customerService.getCustomerById(req.params.id);
            res.json(customer);
        } catch (err) {
            next(err);
        }
    }

    async getCustomerByCCCD(req, res, next) {
        try {
            const customer = await this.customerService.getCustomerByCCCD(req.params.cccd);
            res.json(customer);
        } catch (err) {
            next(err);
        }
    }

    async getCustomerByPhone(req, res, next) {
        try {
            const customer = await this.customerService.getCustomerByPhone(req.params.phone);
            res.json(customer);
        } catch (err) {
            next(err);
        }
    }

    async createCustomer(req, res, next) {
        try {
            const newCustomer = await this.customerService.createCustomer(req.body);
            res.status(201).json(newCustomer);
        } catch (err) {
            next(err);
        }
    }

    async updateCustomer(req, res, next) {
        try {
            const updatedCustomer = await this.customerService.updateCustomer(
                req.params.id,
                req.body
            );
            res.json(updatedCustomer);
        } catch (err) {
            next(err);
        }
    }

    async deleteCustomer(req, res, next) {
        try {
            await this.customerService.deleteCustomer(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }

    async uploadCCCDImage(req, res, next) {
        try {
            if (!req.file) {
                throw new Error('No image file provided');
            }

            const imageUrl = await this.customerService.uploadCCCDImage(
                req.params.id,
                req.file.path
            );

            res.json({ success: true, imageUrl });
        } catch (err) {
            next(err);
        }
    }

    async deleteCCCDImage(req, res, next) {
        try {
            await this.customerService.deleteCCCDImage(req.params.id);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CustomerController;