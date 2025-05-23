import PayOS from "@payos/node";
import config from "../config/payos.js";
import databaseInstance from "../config/database.js";

const { client_id, api_key, checksum_key } = config;
const payOS = new PayOS(client_id, api_key, checksum_key);

class PaymentService {
  static pool = databaseInstance.getPool();

  static async createPaymentLink(paymentData, bookingData) {
    try {
      await this.pool.query(
        "INSERT INTO PendingBookings (orderCode, bookingData) VALUES (?, ?)",
        [paymentData.orderCode, JSON.stringify(bookingData)]
      );
      return await payOS.createPaymentLink(paymentData);
    } catch (error) {
      console.error("Error in createPaymentLink:", error);
      throw error;
    }
  }

  static async getPendingBooking(orderCode) {
    try {
      const [rows] = await this.pool.query(
        "SELECT bookingData FROM PendingBookings WHERE orderCode = ?",
        [orderCode]
      );
      return rows.length > 0 ? JSON.parse(rows[0].bookingData) : null;
    } catch (error) {
      console.error("Error in getPendingBooking:", error);
      throw error;
    }
  }

  static async deletePendingBooking(orderCode) {
    try {
      await this.pool.query("DELETE FROM PendingBookings WHERE orderCode = ?", [orderCode]);
    } catch (error) {
      console.error("Error in deletePendingBooking:", error);
      throw error;
    }
  }

  static async getPaymentLinkInfo(orderId) {
    return await payOS.getPaymentLinkInformation(orderId);
  }

  static async cancelPaymentLink(orderId, cancellationReason) {
    return await payOS.cancelPaymentLink(orderId, { cancellationReason });
  }

  static async confirmWebhook(webhookUrl) {
    return await payOS.confirmWebhook(webhookUrl);
  }
}

export default PaymentService;