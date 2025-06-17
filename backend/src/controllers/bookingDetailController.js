import expressAsyncHandler from "express-async-handler";
import BookingDetailService from "../services/bookingDetailService.js";
import EmailService from "../services/emailService.js";

class BookingDetailController {
  getAll = expressAsyncHandler(async (req, res) => {
    const data = await BookingDetailService.getAll();
    res.json(data);
  });

  getById = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId } = req.params;
    const item = await BookingDetailService.getById(bookingDetailId);
    res.json(item);
  });

  create = expressAsyncHandler(async (req, res) => {
    const newItem = await BookingDetailService.create(req.body);
    res.status(201).json(newItem);
  });

  updateCheckIn = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, text } = req.body;
    const updated = await BookingDetailService.updateCheckIn(bookingDetailId, text);
    res.json(updated);
  });

  updateCheckOut = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, text } = req.body;
    const updated = await BookingDetailService.updateCheckOut(bookingDetailId, text);
    res.json(updated);
  });

  updateStatus = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId, status } = req.body;
    const updated = await BookingDetailService.updateStatus(bookingDetailId, status);
    res.json(updated);
  });

  delete = expressAsyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;
    await BookingDetailService.delete(bookingId, roomId);
    res.status(204).end();
  });

  cancelBookingUsageDetail = expressAsyncHandler(async (req, res) => {
    const { bookingDetailId } = req.body;
    const customerData = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone
    };
    const result = await BookingDetailService.cancelBookingDetail(bookingDetailId);
    const bookingDetail = await BookingDetailService.getById(bookingDetailId);
    if (bookingDetail.HinhThucThanhToan === "Online" && result === true) {
      await EmailService.sendCancelBookingEmailWithHTMLTemplate("Xác nhận hủy đặt phòng - The Royal Hotel", customerData, bookingDetail);
    }
    return res.status(204).json({
      success: true,
      msg: "Đã hủy đặt phòng thành công - Email đã được gửi"
    });
  });
}

export default new BookingDetailController();