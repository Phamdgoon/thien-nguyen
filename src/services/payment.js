import axios from "axios";
import crypto from "crypto";
import db from "../models";

const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;
const redirectUrl = process.env.MOMO_REDIRECT_URL;
const ipnUrl = process.env.MOMO_IPN_URL;

export const createPayment = async (paymentData) => {
    const {
        amount,
        userId,
        campaignId,
        orderInfo = "pay with MoMo",
    } = paymentData;

    try {
        const donation = await db.Donation.create({
            campaignId,
            userId,
            amount,
            donationDate: new Date(),
        });

        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const requestType = "payWithMethod";
        const lang = "vi";
        const autoCapture = true;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = JSON.stringify({
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData: "",
            orderGroupId: "",
            signature,
        });

        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        const result = await axios(options);

        await db.Payment.create({
            donationId: donation.id,
            orderId,
            paymentMethod: "MoMo",
            paymentStatus: "Pending",
        });

        return result.data;
    } catch (error) {
        console.error("Error in createPayment:", error);
        throw new Error("MoMo payment API error");
    }
};

export const handleCallback = async (callbackData) => {
    const { orderId, resultCode } = callbackData;

    try {
        const payment = await db.Payment.findOne({
            where: { orderId },
            include: [
                {
                    model: db.Donation,
                    as: "donation",
                    include: [
                        {
                            model: db.Campaign,
                            as: "campaign",
                        },
                    ],
                },
            ],
        });

        const updatedStatus = resultCode === 0 ? "Success" : "Failed";

        payment.paymentStatus = updatedStatus;
        payment.paymentDate = new Date();

        await payment.save();
        if (resultCode === 0) {
            const campaign = payment.donation.campaign;

            if (campaign) {
                const currentAmount = parseFloat(
                    campaign.currentAmount.replace(/[^0-9]/g, "") || "0"
                );
                const donationAmount = parseFloat(
                    payment.donation.amount.replace(/[^0-9]/g, "") || "0"
                );
                const updatedAmount = currentAmount + donationAmount;
                campaign.currentAmount = `${updatedAmount
                    .toLocaleString("vi-VN")
                    .replace(/,/g, ".")}đ`;

                await campaign.save();
            }
        }

        return updatedStatus;
    } catch (error) {
        console.error("Error in handleCallback:", error);
        throw error;
    }
};

export const getTransactionStatus = async (transactionData) => {
    const { orderId } = transactionData;

    try {
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang: "vi",
        };

        const result = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/query",
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result.data;
    } catch (error) {
        console.error(
            "[ERROR] Error in getTransactionStatus:",
            error.message,
            error
        );
        throw new Error("MoMo transaction status API error");
    }
};
