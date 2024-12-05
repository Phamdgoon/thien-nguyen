import db from "../models";

export const registerVolunteerService = (campaignId, body, userId) =>
    new Promise(async (resolve, reject) => {
        try {
            const campaign = await db.Campaign.findByPk(campaignId);
            if (!campaign) {
                return resolve({
                    err: 1,
                    msg: "Campaign does not exist.",
                });
            }
            let volunteer = await db.Volunteer.findOne({ where: { userId } });
            if (!volunteer) {
                volunteer = await db.Volunteer.create({
                    userId,
                    skills: body.skills,
                    experience: body.experience,
                    taskName: "Chưa có",
                });
            }
            const pendingStatus = await db.Status.findOne({
                where: { name: "Chưa duyệt", entityType: "volunteer" },
            });

            if (!pendingStatus) {
                return resolve({
                    err: 1,
                    msg: "Status 'Chưa duyệt' does not exist.",
                });
            }

            await volunteer.update({
                statusId: pendingStatus.id,
            });
            const isRegistered = await db.VolunteerCampaign.findOne({
                where: {
                    volunteerId: volunteer.id,
                    campaignId,
                },
            });

            if (isRegistered) {
                return resolve({
                    err: 1,
                    msg: "You have signed up to volunteer for this campaign.",
                });
            }

            await db.VolunteerCampaign.create({
                volunteerId: volunteer.id,
                campaignId,
            });
            const volunteerData = {
                volunteerId: volunteer.id,
                userId: volunteer.userId,
                skills: volunteer.skills,
                experience: volunteer.experience,
                taskName: volunteer.taskName,
                statusId: volunteer.statusId,
                status: pendingStatus.name,
                campaignId: campaignId.trim(),
            };
            resolve({
                err: 0,
                msg: "Register volunteer successfully",
                data: volunteerData,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllVolunteerService = (organizationId) =>
    new Promise(async (resolve, reject) => {
        try {
            const volunteers = await db.Volunteer.findAll({
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["name"],
                    },
                    {
                        model: db.Status,
                        as: "status",
                        where: { entityType: "volunteer" },
                        attributes: ["name", "entityType"],
                    },
                    {
                        model: db.VolunteerCampaign,
                        as: "volunteerCampaigns",
                        include: [
                            {
                                model: db.Campaign,
                                as: "campaign",
                                where: { organizationId },
                                attributes: ["id", "title"],
                            },
                        ],
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] },
                where: {
                    "$volunteerCampaigns.campaign.organizationId$":
                        organizationId,
                },
            });
            const approvedVolunteer = volunteers.filter(
                (volunteer) => volunteer.status.name === "Đã duyệt"
            );
            const notApprovedVolunteer = volunteers.filter(
                (volunteer) => volunteer.status.name === "Chưa duyệt"
            );

            resolve({
                err: 0,
                msg: "Fetched all volunteers successfully",
                data: volunteers,
                approvedVolunteer,
                notApprovedVolunteer,
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteVolunteerService = (volunteerId) =>
    new Promise(async (resolve, reject) => {
        try {
            const volunteerDeleted = await db.Volunteer.destroy({
                where: { id: volunteerId },
            });
            if (!volunteerDeleted) {
                throw new Error("Failed to delete volunteer");
            }
            const volunteerCampaignDeleted = await db.VolunteerCampaign.destroy(
                {
                    where: { volunteerId: volunteerId },
                }
            );
            if (!volunteerCampaignDeleted) {
                throw new Error(
                    "Failed to delete volunteer campaign associations"
                );
            }
            await db.Task.destroy({
                where: { volunteerId: volunteerId },
            });
            resolve({
                err: 0,
                msg: "Delete success",
            });
        } catch (error) {
            reject({
                err: 1,
                msg:
                    error.message ||
                    "Failed to delete volunteer and campaign association",
            });
        }
    });

export const approvedVolunteerService = async (volunteerId) =>
    new Promise(async (resolve, reject) => {
        try {
            const approvedStatus = await db.Status.findOne({
                where: { name: "Đã duyệt", entityType: "volunteer" },
            });
            const volunteerUpdated = await db.Volunteer.update(
                {
                    statusId: approvedStatus.id,
                },
                {
                    where: { id: volunteerId },
                }
            );

            if (!volunteerUpdated[0]) {
                return resolve({
                    err: 1,
                    msg: "Failed to update volunteer status",
                });
            }

            resolve({
                err: 0,
                msg: "Volunteer approved successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getVolunteerByIdService = (userId) =>
    new Promise(async (resolve, reject) => {
        try {
            const volunteers = await db.Volunteer.findAll({
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["name"],
                        where: { id: userId },
                    },
                    {
                        model: db.Status,
                        as: "status",
                        where: { entityType: "volunteer" },
                        attributes: ["name", "entityType"],
                    },
                    {
                        model: db.VolunteerCampaign,
                        as: "volunteerCampaigns",
                        include: [
                            {
                                model: db.Campaign,
                                as: "campaign",
                                attributes: ["id", "title", "startDate"],
                            },
                        ],
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                    {
                        model: db.Task,
                        as: "tasks",
                        include: [
                            {
                                model: db.TaskType,
                                as: "taskType",
                                attributes: ["description"],
                            },
                        ],
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            resolve({
                err: 0,
                msg: "Fetched volunteer data successfully",
                data: volunteers,
            });
        } catch (error) {
            reject(error);
        }
    });
