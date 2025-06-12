import expressAsyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";
import EmailController from "./emailController.js";
import BookingService from "../services/bookingService.js";
import ServiceService from "../services/serviceService.js";
import RoomTypeService from "../services/roomTypeService.js";

class PaymentController {
  createPaymentLink = expressAsyncHandler(async (req, res) => {
    console.log("==> Đã vào createPaymentLink"); // Thêm dòng log này

    const bookingData = req.bookingData;

    try {
      // Gọi BookingService.customerOrder để xử lý đặt phòng và dịch vụ
      const orderResult = await BookingService.customerOrder(bookingData);
      console.log("Order result:", orderResult); // Log kết quả order
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

      //Tạo orderCode
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
        { ...bookingData, orderResult }
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

  updateBookingStatusFromReturn = expressAsyncHandler(async (req, res) => {
    try {
      const { orderCode, status } = req.body;
      if (!orderCode || !status) {
        return res.status(400).json({
          error: -1,
          message: "Missing orderCode or status",
        });
      }

      await PaymentService.updateBookingStatus(status, orderCode);
      return res.json({
        error: 0,
        message: "Booking status updated successfully",
      });
    } catch (error) {
      console.error("Error in updateBookingStatusFromReturn:", error);
      return res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
    }
  });

  getBookingStatus = expressAsyncHandler(async (req, res) => {
    try {
      const { orderCode } = req.params;
      if (!orderCode) {
        return res.status(400).json({
          error: -1,
          message: "Missing orderCode",
          data: null,
        });
      }

      const bookingData = await PaymentService.getBookingStatus(orderCode);

      if (!bookingData) {
        return res.status(404).json({
          error: -1,
          message: "Booking not found",
          data: null,
        });
      }

      return res.json({
        error: 0,
        message: "Success",
        data: bookingData,
      });
    } catch (error) {
      console.error("Error in getBookingStatus:", error);
      return res.status(500).json({
        error: -1,
        message: "Internal server error",
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
    if (data.desc === "success") {
      const bookingResult = await PaymentService.getPendingBooking(data.orderCode);
      if (!bookingResult) {
        return res.status(400).json({
          error: -1,
          message: "Booking data not found",
          data: null,
        });
      }

      try {
        console.log("Attempting to send booking confirmation email...");
        const fakeReq = {
          body: {
            isOnline: bookingResult.isOnline,
            fullName: bookingResult.fullName,
            email: bookingResult.email,
            phone: bookingResult.phone,
            roomRequests: bookingResult.roomRequests,
            serviceRequests: bookingResult.serviceRequests,
            bookingResult: bookingResult.orderResult,
          },
        };
        const result = await EmailController.sendBookingConfirmation(fakeReq);
        //await PaymentService.deletePendingBooking(data.orderCode);
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

    console.log("Webhook received but not processed, desc:", data.desc);
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