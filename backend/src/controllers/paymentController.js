import expressAsyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";
import EmailController from "./emailController.js";
import crypto from "crypto";

class PaymentController {
  createPaymentLink = expressAsyncHandler(async (req, res) => {
    const { description, returnUrl, cancelUrl, amount, items } = req.body;
    const bookingData = req.bookingData; // Lấy từ middleware

    try {
      const paymentLink = await PaymentService.createPaymentLink(
        {
          orderCode: Number(String(new Date().getTime()).slice(-6)),
          amount,
          description,
          items,
          cancelUrl,
          returnUrl,
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
          () => {}
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