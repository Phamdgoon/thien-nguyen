import * as services from "../services/category";

export const GetCategories = async (req, res) => {
    try {
        const response = await services.getCategoriesService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at category controller: " + error,
        });
    }
};

export const GetCampaignsByCategory = async (req, res) => {
    try {
        const { categoryCode } = req.query;
        const response = await services.getCampaignsByCategoryService(
            categoryCode
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at category controller: " + error,
        });
    }
};
