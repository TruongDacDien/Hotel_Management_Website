import expressAsyncHandler from "express-async-handler";
import ServiceUsageDetailService from "../services/serviceUsageDetailService.js";
import EmailService from "../services/emailService.js";
import ServiceService from "../services/serviceService.js";

class ServiceUsageDetailController {
    getAll = expressAsyncHandler(async (req, res) => {
        const data = await ServiceUsageDetailService.getAll();
        res.json(data);
    });

    getById = expressAsyncHandler(async (req, res) => {
        const { serviceUsageDetailId } = req.body;
        const item = await ServiceUsageDetailService.getById(serviceUsageDetailId);
        res.json(item);
    });

    create = expressAsyncHandler(async (req, res) => {
        const newItem = await ServiceUsageDetailService.create(req.body);
        res.status(201).json(newItem);
    });

    update = expressAsyncHandler(async (req, res) => {
        const { bookingId, serviceId } = req.params;
        const updated = await ServiceUsageDetailService.update(bookingId, serviceId, req.body);
        res.json(updated);
    });

    delete = expressAsyncHandler(async (req, res) => {
        const { bookingId, serviceId } = req.params;
        await ServiceUsageDetailService.delete(bookingId, serviceId);
        res.status(204).end();
    });

    cancelServiceUsageDetail = expressAsyncHandler(async (req, res) => {
        const { serviceUsageDetailId } = req.body;
        const customerData = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone
        };
        const result = await ServiceUsageDetailService.cancelServiceUsageDetail(serviceUsageDetailId);
        const serviceDetail = await ServiceUsageDetailService.getById(serviceUsageDetailId);
        const service = await ServiceService.getServiceById(serviceDetail.MaDV);
        await ServiceService.findByIdAndUpdateQuantity(service.MaDV, service.SoLuong + serviceDetail.SL);
        if (result === true) {
            await EmailService.sendCancelServiceEmailWithHTMLTemplate("Xác nhận hủy đặt dịch vụ - The Royal Hotel", customerData, serviceDetail);
        }
        return res.status(204).json({
            success: true,
            msg: "Đã hủy đặt dịch vụ thành công - Email đã được gửi"
        });
    });
}

export default new ServiceUsageDetailController();