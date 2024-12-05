import * as services from "../services/campaign";

export const createNewCampaign = async (req, res) => {
    try {
        const {
            title,
            description,
            targetAmount,
            startDate,
            endDate,
            images,
            category,
        } = req.body;
        const organizationId = req.user.id;

        if (
            !title ||
            !description ||
            !startDate ||
            !endDate ||
            !targetAmount ||
            !images ||
            images.length === 0 ||
            !category
        ) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }
        const response = await services.createNewCampaignService(
            req.body,
            organizationId
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at create campaign controller: " + error,
        });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const response = await services.getCampaignsSerivce();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaignId = req.query.id;

        const response = await services.getCampaignByIdSerivce(campaignId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};

export const getCampaignLimitOrganization = async (req, res) => {
    const organizationId = req.user.id;

    try {
        if (!organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.getCampaignLimitOrganizationService(
            organizationId
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};

export const deleteCampaign = async (req, res) => {
    const campaignId = req.query.id;
    const organizationId = req.user.id;

    try {
        if (!campaignId || !organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.deleteCampaignService(campaignId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};

export const approvedCampaign = async (req, res) => {
    const campaignId = req.query.id;
    const userId = req.user.id;

    try {
        if (!campaignId || !userId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.approvedCampaignService(campaignId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at change role controller: " + error,
        });
    }
};

export const updateCampaign = async (req, res) => {
    const campaignId = req.query.id;
    const organizationId = req.user.id;
    const updateData = req.body;

    try {
        if (!campaignId || !organizationId) {
            return res.status(400).json({
                err: 1,
                msg: "Missing campaignId or organizationId",
            });
        }

        const response = await services.updateCampaignService(
            campaignId,
            organizationId,
            updateData
        );

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error.message,
        });
    }
};

export const getInfo = async (req, res) => {
    try {
        const response = await services.getInfoService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};
