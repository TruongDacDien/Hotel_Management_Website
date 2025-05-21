import PayOS from "@payos/node";
import config from "../config/payos.js";

const { client_id, api_key, checksum_key } = config;
const payOS = new PayOS(client_id, api_key, checksum_key);

class PaymentService {
    static async createPaymentLink(paymentData) {
        return await payOS.createPaymentLink(paymentData);
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