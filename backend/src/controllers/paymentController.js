import expressAsyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";
import EmailController from "./emailController.js";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import BookingService from "../services/bookingService.js";

class PaymentController {
  createPaymentLink = expressAsyncHandler(async (req, res) => {
    const bookingData = req.bookingData; // Lấy từ middleware
    try {
      // Gọi BookingService.customerOrder để xử lý đặt phòng và dịch vụ
      const orderResult = await BookingService.customerOrder(bookingData);

      // Lấy thông tin loại phòng và dịch vụ
      const roomTypePromises = orderResult.roomResults.map(async (result) => {
        if (result.roomTypeId) {
          const roomType = await RoomTypeService.getById(result.roomTypeId);
          return {
            ...result,
            TenLoaiPhong: roomType?.TenLoaiPhong || "Unknown",
          };
        }
        return result;
      });

      const servicePromises = orderResult.serviceResults.map(async (result) => {
        if (result.serviceId) {
          const service = await ServiceService.getServiceById(result.serviceId);
          return {
            ...result,
            TenDV: service?.TenDV || "Unknown",
            Gia: service?.Gia || 0,
          };
        }
        return result;
      });

      const enrichedRoomResults = await Promise.all(roomTypePromises);
      const enrichedServiceResults = await Promise.all(servicePromises);

      // Tạo danh sách items cho PayOS
      const items = [];

      // Thêm phòng vào items
      enrichedRoomResults.forEach((result) => {
        if (result.bookings && result.bookings.length > 0) {
          result.bookings.forEach((booking) => {
            if (booking.bookingDetail) {
              items.push({
                name: `${result.TenLoaiPhong} (${booking.bookingDetail.SoPhong})`,
                quantity: 1, // Mỗi booking đại diện cho 1 phòng
                price: parseFloat(booking.bookingDetail.TienPhong),
              });
            }
          });
        }
      });

      // Thêm dịch vụ vào items
      enrichedServiceResults.forEach((result) => {
        if (result.bookedServices > 0) {
          items.push({
            name: result.TenDV,
            quantity: result.bookedServices,
            price: parseFloat(result.Gia),
          });
        }
      });

      // Tính tổng tiền
      const totalRoomMoney = enrichedRoomResults.reduce((sum, result) => {
        return (
          sum +
          result.bookings.reduce((roomSum, booking) => {
            return roomSum + (parseFloat(booking.bookingDetail?.TienPhong) || 0);
          }, 0)
        );
      }, 0);

      const totalRoomTax = (totalRoomMoney * 10) / 100;

      const totalServiceMoney = enrichedServiceResults.reduce((sum, result) => {
        return sum + (result.totalMoney || 0);
      }, 0);

      const totalServiceTax = (totalServiceMoney * 10) / 100;

      const amount = Math.round(totalRoomMoney + totalRoomTax + totalServiceMoney + totalServiceTax);

      //Thêm thuế vào items
      items.push({
        name: "Thuế VAT",
        quantity: 1,
        price: Math.round(totalRoomTax + totalServiceTax),
      });

      // Tạo payment link với PayOS
      const paymentLink = await PaymentService.createPaymentLink(
        {
          orderCode: uuidv4(),
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

    // Xác minh webhook
    const signature = req.headers["x-payos-signature"];
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
    const rawBody = JSON.stringify(webhookData);
    const computedSignature = crypto
      .createHmac("sha256", checksumKey)
      .update(rawBody)
      .digest("hex");

    if (signature !== computedSignature) {
      return res.status(400).json({
        error: -1,
        message: "Invalid webhook signature",
        data: null,
      });
    }

    // Xử lý webhook
    const { orderCode, status } = webhookData;
    if (status === "PAID") {
      const bookingData = await PaymentService.getPendingBooking(orderCode);
      if (!bookingData) {
        return res.status(404).json({
          error: -1,
          message: "Booking data not found",
          data: null,
        });
      }

      try {
        const result = await EmailController.sendBookingConfirmation(
          { body: bookingData },
          res,
          () => { }
        );
        await PaymentService.deletePendingBooking(orderCode);
        return res.json({
          error: 0,
          message: "Webhook processed successfully",
          data: result.data,
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

    return res.json({
      error: 0,
      message: "Webhook received",
      data: null,
    });
  });

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