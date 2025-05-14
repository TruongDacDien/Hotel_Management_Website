import expressAsyncHandler from "express-async-handler";
import CustomerService from "../services/customerService.js";

class CustomerController {
    getAllCustomers = expressAsyncHandler(async (req, res) => {
        const customers = await CustomerService.getAllCustomers();
        res.json(customers);
    });

    getCustomerById = expressAsyncHandler(async (req, res) => {
        const customer = await CustomerService.getCustomerById(req.params.id);
        res.json(customer);
    });

    getCustomerByCCCD = expressAsyncHandler(async (req, res) => {
        const customer = await CustomerService.getCustomerByCCCD(req.params.cccd);
        res.json(customer);
    });

    getCustomerByPhone = expressAsyncHandler(async (req, res) => {
        const customer = await CustomerService.getCustomerByPhone(req.params.phone);
        res.json(customer);
    });

    createCustomer = expressAsyncHandler(async (req, res) => {
        const newCustomer = await CustomerService.createCustomer(req.body);
        res.status(201).json(newCustomer);
    });

    updateCustomer = expressAsyncHandler(async (req, res) => {
        const updatedCustomer = await CustomerService.updateCustomer(req.params.id, req.body);
        res.json(updatedCustomer);
    });

    deleteCustomer = expressAsyncHandler(async (req, res) => {
        await CustomerService.deleteCustomer(req.params.id);
        res.status(204).end();
    });

    uploadCCCDImage = expressAsyncHandler(async (req, res) => {
        if (!req.file) {
            throw new Error('No image file provided');
        }

        const imageUrl = await CustomerService.uploadCCCDImage(req.params.id, req.file.path);
        res.json({ success: true, imageUrl });
    });

    deleteCCCDImage = expressAsyncHandler(async (req, res) => {
        await CustomerService.deleteCCCDImage(req.params.id);
        res.json({ success: true });
    });
}

export default new CustomerController();