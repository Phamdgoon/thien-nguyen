import db from "../models";

export const getTaskTypesService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.TaskType.findAll({
                raw: true,
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });
            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get tasktype.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });
export const assignTaskService = (volunteerId, taskTypeId) =>
    new Promise(async (resolve, reject) => {
        try {
            const volunteer = await db.Volunteer.findOne({
                where: { id: volunteerId },
                include: [
                    {
                        model: db.Status,
                        as: "status",
                        where: { name: "Đã duyệt", entityType: "volunteer" },
                    },
                    {
                        model: db.VolunteerCampaign,
                        as: "volunteerCampaigns",
                        attributes: ["campaignId"],
                    },
                ],
            });

            if (!volunteer) {
                return reject({
                    err: 1,
                    msg: "Volunteer not found or not approved",
                });
            }
            const taskType = await db.TaskType.findOne({
                where: { id: taskTypeId },
            });

            if (!taskType) {
                return reject({
                    err: 1,
                    msg: "Task type not found",
                });
            }
            const taskName = taskType.name;
            volunteer.taskName = taskName;
            await volunteer.save();

            const campaignId = volunteer.volunteerCampaigns[0]?.campaignId;
            if (!campaignId) {
                return reject({
                    err: 1,
                    msg: "CampaignId not found for the volunteer",
                });
            }

            const newTask = await db.Task.create({
                volunteerId,
                campaignId,
                taskTypeId,
            });

            resolve({
                err: 0,
                msg: "Task assigned successfully",
                response: { volunteer, newTask },
            });
        } catch (error) {
            reject({
                err: -1,
                msg: "Failed at assignTaskService: " + error.message,
            });
        }
    });
