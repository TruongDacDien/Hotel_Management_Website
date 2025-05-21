import paymentService from "../services/paymentService";

class PaymentController {
    createPaymentLink = expressAsyncHandler(async (req, res) => {
        const { description, returnUrl, cancelUrl, amount , items} = req.body;
        try {
            const paymentLink = await paymentService.createPaymentLink({
                orderCode: Number(String(new Date().getTime()).slice(-6)),
                amount,
                description,
                items,
                cancelUrl,
                returnUrl,
            });
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

    getPaymentLinkInfo = expressAsyncHandler(async (req, res) => {
        try {
            const order = await paymentService.getPaymentLinkInfo(req.params.orderId);
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
            const order = await paymentService.cancelPaymentLink(orderId, cancellationReason);
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
            await paymentService.confirmWebhook(webhookUrl);
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