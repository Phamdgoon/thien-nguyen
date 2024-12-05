import * as services from "../services/report";

export const getDonationsByTime = async (req, res) => {
    const { timePeriod } = req.query;

    if (!["year", "quarter", "month"].includes(timePeriod)) {
        return res.status(400).json({
            err: -1,
            msg: "Invalid timePeriod. Please use 'year', 'quarter', or 'month'.",
        });
    }

    try {
        const response = await services.getDonationsByTimeService(timePeriod);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at report controller: " + error,
        });
    }
};
export const getCampaignsOrganizationByTime = async (req, res) => {
    const { timePeriod } = req.query;

    if (!["year", "quarter", "month"].includes(timePeriod)) {
        return res.status(400).json({
            err: -1,
            msg: "Invalid timePeriod. Please use 'year', 'quarter', or 'month'.",
        });
    }

    try {
        const response = await services.getCampaignsOrganizationByTimeService(
            timePeriod
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at report controller: " + error,
        });
    }
};
