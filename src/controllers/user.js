import * as services from "../services/user";

export const getCurrent = async (req, res) => {
    const { id } = req.user;
    try {
        const response = await services.getCurrentService(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.user;
    const payload = req.body;
    try {
        if (!payload) {
            return res.status(400).json({
                err: 1,
                msg: "Missing input",
            });
        }
        const response = await services.updateUserService(payload, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const response = await services.getAllUserService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.query;
    const userId = req.user?.id;

    try {
        if (!id || !userId) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }

        const response = await services.deleteUserService(id);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error.message,
        });
    }
};

export const chatUser = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                err: -1,
                msg: "Vui lòng cung cấp tin nhắn.",
            });
        }

        const response = await services.chatUserService(message);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at chat user controller: " + error.message,
        });
    }
};

export const getDonationById = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: "Missing userId in query parameters",
            });
        }
        const response = await services.getDonationByIdService(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
};
export const getDonationByCampaignId = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const organizationId = req.user?.id;

        if (!campaignId) {
            return res.status(400).json({
                err: 1,
                msg: "Missing campaignId in request body",
            });
        }
        if (!organizationId) {
            return res.status(403).json({
                err: 1,
                msg: "Unauthorized. Organization not logged in.",
            });
        }
        const response = await services.getDonationByCampaignIdService(
            campaignId,
            organizationId
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
};
