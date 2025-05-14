import express from "express";
import customerController from "../controllers/customerController.js";

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/cccd/:cccd', customerController.getCustomerByCCCD);
router.get('/phone/:phone', customerController.getCustomerByPhone);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
//router.post('/:id/upload-cccd',uploadImage.single('cccdImage'),customerController.uploadCCCDImage);
//router.delete('/:id/delete-cccd-image',customerController.deleteCCCDImage);

export default router;