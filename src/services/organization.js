import db from "../models";

export const getAllOrganizationService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Organization.findAll({
                raw: true,
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });
            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get organization.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteOrganizationService = (organizationId) =>
    new Promise(async (resolve, reject) => {
        try {
            const campaigns = await db.Campaign.findAll({
                where: { organizationId },
                attributes: ["id"],
                raw: true,
            });

            const campaignIds = campaigns.map((campaign) => campaign.id);

            const deletedImages = await db.Image.destroy({
                where: { campaignId: campaignIds },
            });

            const deletedCampaigns = await db.Campaign.destroy({
                where: { organizationId },
            });

            const deletedOrganization = await db.Organization.destroy({
                where: { id: organizationId },
            });

            resolve({
                err: deletedOrganization ? 0 : 1,
                msg: deletedOrganization
                    ? `Organization, ${deletedCampaigns} campaigns, and ${deletedImages} images deleted successfully.`
                    : "Failed to delete organization.",
            });
        } catch (error) {
            reject(error);
        }
    });
