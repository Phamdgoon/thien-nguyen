import db from "../models";
import { Op } from "sequelize";
import moment from "moment";

export const createNewCampaignService = (data, organizationId) =>
    new Promise(async (resolve, reject) => {
        try {
            const userRole = await db.UserRole.findOne({
                where: {
                    organizationId: organizationId,
                    roleId: 2,
                },
            });

            if (!userRole) {
                return reject(
                    new Error(
                        "User does not have permission to create campaign"
                    )
                );
            }
            const status = await db.Status.findOne({
                where: { name: "Chưa duyệt", entityType: "campaign" },
            });
            const organization = await db.Organization.findOne({
                where: { id: organizationId },
            });
            if (!organization) {
                return reject(new Error("Organization not found"));
            }
            const category = await db.Category.findOne({
                where: { value: data.category },
            });
            const formattedTargetAmount = `${data.targetAmount
                .toLocaleString("vi-VN")
                .replace(/,/g, ".")}đ`;
            const newCampaign = await db.Campaign.create({
                organizationId: organization.id,
                statusId: status.id,
                categoryId: category.id,
                title: data.title,
                description: data.description,
                targetAmount: formattedTargetAmount,
                startDate: data.startDate,
                endDate: data.endDate,
                currentAmount: 0,
            });

            if (data.images && data.images.length > 0) {
                for (let i = 0; i < data.images.length; i++) {
                    await db.Image.create({
                        campaignId: newCampaign.id,
                        image: data.images[i],
                    });
                }
            }
            resolve({
                err: 0,
                msg: "Campaign created successfully",
                campaign: newCampaign,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getCampaignsSerivce = () =>
    new Promise(async (resolve, reject) => {
        try {
            await db.Campaign.update(
                { statusId: 3 },
                {
                    where: {
                        endDate: { [Op.lt]: new Date() },
                    },
                }
            );
            const response = await db.Campaign.findAll({
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.Image,
                        as: "images",
                        attributes: ["image"],
                    },
                    {
                        model: db.Category,
                        as: "category",
                        attributes: ["code", "value"],
                    },
                    {
                        model: db.Organization,
                        as: "organization",
                        attributes: ["image", "name"],
                    },
                    {
                        model: db.Status,
                        as: "status",
                        attributes: ["name"],
                    },
                ],

                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });

            const activeCampaigns = response.filter(
                (campaign) =>
                    new Date(campaign.endDate) >= new Date() &&
                    campaign.status.name !== "Chưa duyệt"
            );
            const expiredCampaigns = response.filter(
                (campaign) => new Date(campaign.endDate) < new Date()
            );
            const notApprovedCampaigns = response.filter(
                (campaign) => campaign.status.name === "Chưa duyệt"
            );

            resolve({
                err: 0,
                msg: "OK",
                response,
                activeCampaigns,
                expiredCampaigns,
                notApprovedCampaigns,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getCampaignByIdSerivce = (campaignId) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Campaign.findOne({
                where: { id: campaignId },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.Image,
                        as: "images",
                        attributes: ["image"],
                    },
                    {
                        model: db.Category,
                        as: "category",
                        attributes: ["code", "value"],
                    },
                    {
                        model: db.Organization,
                        as: "organization",
                        attributes: [
                            "image",
                            "name",
                            "description",
                            "address",
                            "email",
                            "phone",
                        ],
                    },
                    {
                        model: db.Donation,
                        as: "donations",
                        attributes: ["amount", "donationDate"],
                        include: [
                            {
                                model: db.User,
                                as: "user",
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
            });

            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get campaign.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getCampaignLimitOrganizationService = (organizationId) =>
    new Promise(async (resolve, reject) => {
        try {
            await db.Campaign.update(
                { statusId: 3 },
                {
                    where: {
                        endDate: { [Op.lt]: new Date() },
                    },
                }
            );
            const response = await db.Campaign.findAll({
                where: {
                    organizationId,
                },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.Image,
                        as: "images",
                        attributes: ["image"],
                    },
                    {
                        model: db.Category,
                        as: "category",
                        attributes: ["code", "value"],
                    },
                    {
                        model: db.Organization,
                        as: "organization",
                        attributes: ["image", "name"],
                    },
                    {
                        model: db.Status,
                        as: "status",
                        attributes: ["name"],
                    },
                ],

                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });

            const activeCampaigns = response.filter(
                (campaign) =>
                    new Date(campaign.endDate) >= new Date() &&
                    campaign.status.name !== "Chưa duyệt"
            );
            const expiredCampaigns = response.filter(
                (campaign) => new Date(campaign.endDate) < new Date()
            );
            const notApprovedCampaigns = response.filter(
                (campaign) => campaign.status.name === "Chưa duyệt"
            );

            resolve({
                err: 0,
                msg: "OK",
                response,
                activeCampaigns,
                expiredCampaigns,
                notApprovedCampaigns,
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteCampaignService = (campaignId) =>
    new Promise(async (resolve, reject) => {
        try {
            const deletedImages = await db.Image.destroy({
                where: { campaignId },
            });
            const response = await db.Campaign.destroy({
                where: { id: campaignId },
            });
            resolve({
                err: response ? 0 : 1,
                msg: response
                    ? `Campaign and ${deletedImages} related images deleted successfully.`
                    : "Failed to delete campaign.",
            });
        } catch (error) {
            reject(error);
        }
    });

export const approvedCampaignService = async (campaignId) =>
    new Promise(async (resolve, reject) => {
        try {
            const approvedStatus = await db.Status.findOne({
                where: { name: "Đã duyệt", entityType: "campaign" },
            });
            const campaignUpdated = await db.Campaign.update(
                {
                    statusId: approvedStatus.id,
                },
                {
                    where: { id: campaignId },
                }
            );

            if (!campaignUpdated[0]) {
                return resolve({
                    err: 1,
                    msg: "Failed to update campaign status",
                });
            }

            resolve({
                err: 0,
                msg: "Campaign approved successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateCampaignService = (campaignId, organizationId, updateData) =>
    new Promise(async (resolve, reject) => {
        try {
            const campaign = await db.Campaign.findOne({
                where: { id: campaignId, organizationId },
            });
            if (!campaign) {
                return resolve({
                    err: 1,
                    msg: "Campaign not found or unauthorized",
                });
            }

            if (updateData.targetAmount) {
                updateData.targetAmount = `${updateData.targetAmount
                    .toLocaleString("vi-VN")
                    .replace(/,/g, ".")}đ`;
            }
            if (updateData.startDate) {
                const currentStartDate = moment(campaign.startDate);
                updateData.startDate = moment(updateData.startDate)
                    .set({
                        hour: currentStartDate.hour(),
                        minute: currentStartDate.minute(),
                        second: currentStartDate.second(),
                        millisecond: currentStartDate.millisecond(),
                    })
                    .toISOString();
            }

            if (updateData.endDate) {
                const currentEndDate = moment(campaign.endDate);
                updateData.endDate = moment(updateData.endDate)
                    .set({
                        hour: currentEndDate.hour(),
                        minute: currentEndDate.minute(),
                        second: currentEndDate.second(),
                        millisecond: currentEndDate.millisecond(),
                    })
                    .toISOString();
            }

            const updatedCampaign = await db.Campaign.update(updateData, {
                where: { id: campaignId },
            });
            resolve({
                err: updatedCampaign ? 0 : 1,
                msg: updatedCampaign
                    ? "Campaign updated successfully"
                    : "Failed to update campaign",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getInfoService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const totalCampaign = await db.Campaign.count();

            const totalOrganization = await db.Organization.count();

            const totalDonations = await db.Donation.count();

            const totalAmount = await db.Donation.sum("amount");

            resolve({
                err: 0,
                msg: "OK",
                totalCampaign,
                totalOrganization,
                totalDonations,
                totalAmount,
            });
        } catch (error) {
            reject({
                err: -1,
                msg: "Failed to get info: " + error,
            });
        }
    });
