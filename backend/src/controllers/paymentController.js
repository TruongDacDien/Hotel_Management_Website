import expressAsyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";
import EmailController from "./emailController.js";
import BookingService from "../services/bookingService.js";
import ServiceService from "../services/serviceService.js";
import RoomTypeService from "../services/roomTypeService.js";
import EmailService from "../services/emailService.js";

class PaymentController {
  createPaymentLink = expressAsyncHandler(async (req, res) => {
    console.log("==> Đã vào createPaymentLink"); // Thêm dòng log này

    const bookingData = req.bookingData;

    try {
      // Tạo danh sách items cho PayOS
      const items = [];

      // Tổng tiền phòng + dịch vụ trước thuế
      let totalPrice = 0;

      // Thêm loại phòng vào items
      for (const roomRequest of bookingData.roomRequests) {
        const roomType = await RoomTypeService.getById(roomRequest.roomTypeId);
        const start = new Date(roomRequest.startDay);
        const end = new Date(roomRequest.endDay);
        const diffTime = end - start;
        const numNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const roomTotal = numNights * roomRequest.numberOfRooms * roomType.GiaNgay;
        items.push({
          name: roomType.TenLoaiPhong,
          quantity: roomRequest.numberOfRooms,
          price: parseFloat(roomTotal),
        });
        totalPrice += roomTotal;
      }

      // Thêm dịch vụ vào items
      for (const serviceRequest of bookingData.serviceRequests) {
        const service = await ServiceService.getServiceById(serviceRequest.serviceId);
        const serviceTotal = service.Gia * serviceRequest.quantity;
        items.push({
          name: service.TenDV,
          quantity: serviceRequest.quantity,
          price: parseFloat(serviceTotal),
        });
        totalPrice += serviceTotal;
      }

      // Tính và thêm thuế VAT (10%)
      const tax = Math.round(totalPrice * 0.1); // Làm tròn để tránh số lẻ

      // Thêm thuế vào items
      items.push({
        name: "Thuế VAT",
        quantity: 1,
        price: tax,
      });

      // Tổng tiền sau thuế
      const amount = Math.round(totalPrice + tax);

      // Tạo orderCode
      const generateSafeOrderCode = () => {
        const timestamp = Date.now(); // số ms từ 1970, hiện tại là khoảng 13 chữ số
        const random = Math.floor(Math.random() * 100000); // 5 chữ số
        const orderCode = Number(`${timestamp}${random}`.slice(0, 15)); // cắt bớt nếu vượt quá 15 chữ số

        return Math.min(orderCode, Number.MAX_SAFE_INTEGER); // đảm bảo an toàn
      };

      // Tạo payment link với PayOS
      const paymentLink = await PaymentService.createPaymentLink(
        {
          orderCode: generateSafeOrderCode(),
          amount,
          description: "THANH TOAN KHACH SAN",
          items,
          cancelUrl: "http://localhost:5173/cart",
          returnUrl: "http://localhost:5173/cart",
        },
        bookingData
      );

      return res.json({
        error: 0,
        message: "Success",
        data: {
          bin: paymentLink.bin,
          checkoutUrl: paymentLink.checkoutUrl,
          accountNumber: paymentLink.accountNumber,
          accountName: paymentLink.accountName,
          amount: paymentLink.amount,
          description: paymentLink.description,
          orderCode: paymentLink.orderCode,
          qrCode: paymentLink.qrCode,
        },
      });
    } catch (error) {
      console.error("Error in createPaymentLink:", error);
      return res.json({
        error: -1,
        message: "fail",
        data: null,
      });
    }
  });

  handleWebhook = expressAsyncHandler(async (req, res) => {
    const webhookData = req.body;
    console.log("Webhook data:", webhookData);
    let signature = req.headers["x-payos-signature"];

    // Kiểm tra chữ ký từ body nếu thiếu header
    if (!signature && webhookData?.signature) {
      console.log("Using signature from body:", webhookData.signature);
      signature = webhookData.signature;
    }

    // Xử lý webhook test
    if (!signature || webhookData?.data?.orderCode === 123) {
      console.log("Webhook test received");
      return res.status(200).json({
        error: 0,
        message: "Webhook test confirmed",
        data: null,
      });
    }

    // Kiểm tra chữ ký
    // const computedSignature = crypto
    //   .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY)
    //   .update(JSON.stringify(req.body)) // Dữ liệu gốc từ webhook (raw JSON)
    //   .digest("hex");

    // if (signature !== computedSignature) {
    //   console.log("Signature mismatch:", { received: signature, computed: computedSignature });
    //   return res.status(400).json({
    //     error: -1,
    //     message: "Invalid webhook signature",
    //     data: null,
    //   });
    // }

    // Xử lý webhook
    const { data } = webhookData;
    console.log("Processing webhook with orderCode:", data.orderCode);
    if (webhookData.success === true) {
      const _bookingData = await PaymentService.getPendingBooking(data.orderCode);
      console.log("Dữ liệu booking lấy từ pending:", _bookingData);
      if (!_bookingData) {
        return res.status(400).json({
          error: -1,
          message: "Booking data not found",
          data: null,
        });
      }

      try {
        console.log("Attempting to send booking confirmation email...");
        const bookingData = {
          isOnline: _bookingData.isOnline,
          fullName: _bookingData.fullName,
          email: _bookingData.email,
          phone: _bookingData.phone,
          roomRequests: _bookingData.roomRequests,
          serviceRequests: _bookingData.serviceRequests,
        };
        const result = await EmailService.sendBookingConfirmationByData(bookingData);
        return res.json({
          error: 0,
          message: "Webhook processed successfully",
          data: result,
        });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return res.status(500).json({
          error: -1,
          message: "Failed to process webhook",
          data: null,
        });
      }
    }

    console.log("Webhook received but not processed, desc:", data.desc);
    return res.json({
      error: 0,
      message: "Webhook received",
      data: null,
    });
  });

  deletePendingBooking = expressAsyncHandler(async (req, res) => {
    const { orderCode } = req.params;

    if (!orderCode) {
      return res.status(400).json({ msg: "Missing orderCode" });
    }

    try {
      const deleted = await PaymentService.deletePendingBooking(orderCode);
      if (deleted) {
        return res.status(200).json({ msg: "Deleted successfully" });
      } else {
        return res.status(404).json({ msg: "Order not found" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })

  getPaymentLinkInfo = expressAsyncHandler(async (req, res) => {
    try {
      const order = await PaymentService.getPaymentLinkInfo(req.params.orderId);
      if (!order) {
        return res.json({
          error: -1,
          message: "failed",
          data: null,
        });
      }
      return res.json({
        error: 0,
        message: "ok",
        data: order,
      });
    } catch (error) {
      console.error("Error in getPaymentLinkInfo:", error);
      return res.json({
        error: -1,
        message: "failed",
        data: null,
      });
    }
  });

  cancelPaymentLink = expressAsyncHandler(async (req, res) => {
    try {
      const { orderId } = req.params;
      const { cancellationReason } = req.body;
      const order = await PaymentService.cancelPaymentLink(orderId, cancellationReason);
      if (!order) {
        return res.json({
          error: -1,
          message: "failed",
          data: null,
        });
      }
      return res.json({
        error: 0,
        message: "ok",
        data: order,
      });
    } catch (error) {
      console.error("Error in cancelPaymentLink:", error);
      return res.json({
        error: -1,
        message: "failed",
        data: null,
      });
    }
  });

  confirmWebhook = expressAsyncHandler(async (req, res) => {
    try {
      const { webhookUrl } = req.body;
      await PaymentService.confirmWebhook(webhookUrl);
      return res.json({
        error: 0,
        message: "ok",
        data: null,
      });
    } catch (error) {
      console.error("Error in confirmWebhook:", error);
      return res.json({
        error: -1,
        message: "failed",
        data: null,
      });
    }
  });
}

export default new PaymentController();