import * as services from "../services/payment";

export const paymentHandler = async (req, res) => {
    try {
        const { amount } = req.body;
        const { user } = req;
        const { campaignId } = req.params;

        if (!amount || !campaignId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing required fields: amount or campaignId",
            });
        }
        const paymentData = {
            amount,
            userId: user.id,
            campaignId,
        };
        const result = await services.createPayment(paymentData);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "server error",
        });
    }
};

export const callbackHandler = async (req, res) => {
    try {
        await services.handleCallback(req.body);
        return res.status(200).json(req.body);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "server error",
        });
    }
};

export const transactionStatusHandler = async (req, res) => {
    try {
        const result = await services.getTransactionStatus(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "server error",
        });
    }
};
