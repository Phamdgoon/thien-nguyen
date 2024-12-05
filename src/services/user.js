import db from "../models";
import axios from "axios";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

export const getCurrentService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                raw: true,
                where: { id },
                attributes: { exclude: ["password"] },
            });
            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get user.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateUserService = (payload, id) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.update(payload, { where: { id } });
            resolve({
                err: response[0] > 0 ? 0 : 1,
                msg: response[0] > 0 ? "updated" : "Failed to update user.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllUserService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findAll({
                raw: true,
                attributes: { exclude: ["password", "createdAt", "updatedAt"] },
            });
            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get all user.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteUserService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const volunteers = await db.Volunteer.findAll({
                where: { userId: id },
                attributes: ["id"],
            });

            const volunteerIds = volunteers.map((volunteer) => volunteer.id);

            const deletedVolunteerCampaigns =
                await db.VolunteerCampaign.destroy({
                    where: { volunteerId: volunteerIds },
                });

            const deletedVolunteers = await db.Volunteer.destroy({
                where: { userId: id },
            });

            const deletedUserRoles = await db.UserRole.destroy({
                where: { userId: id },
            });

            const deletedUser = await db.User.destroy({
                where: { id },
            });

            resolve({
                err: deletedUser ? 0 : 1,
                msg: deletedUser
                    ? `User, ${deletedVolunteers} tình nguyện viên, ${deletedVolunteerCampaigns} liên kết tình nguyện, và ${deletedUserRoles} vai trò đã bị xóa thành công.`
                    : "Xóa user thất bại.",
            });
        } catch (error) {
            reject({
                err: -1,
                msg: "Lỗi khi xóa user: " + error.message,
            });
        }
    });

export const chatUserService = (message) =>
    new Promise(async (resolve, reject) => {
        try {
            const GROQ_API_KEY = process.env.GROQ_API_KEY;
            if (!GROQ_API_KEY) {
                return reject({
                    err: -1,
                    msg: "GROQ_API_KEY not found in environment variables.",
                });
            }
            const fixedResponses = {
                "Làm cách nào để quyên góp cho chiến dịch":
                    "Bạn có thể quyên góp tiền mặt qua ứng dụng momo hoặc quyên góp nhu yếu phẩm cho người nhận.",
                "Có thể quyên góp vật phẩm thay vì tiền không":
                    "Có. Bạn có thể thực hiện phương thức ủng hộ vật phẩm thay vì tiền.",
            };
            if (fixedResponses[message]) {
                return resolve({
                    err: 0,
                    msg: "OK",
                    data: fixedResponses[message],
                });
            }
            const categoryKeywordMatch = message.match(
                /Có dự án nào hỗ trợ (.+) không/
            );
            if (categoryKeywordMatch) {
                const categoryName = categoryKeywordMatch[1].trim();

                const category = await db.Category.findOne({
                    where: { value: categoryName },
                });

                if (!category) {
                    return reject({
                        err: -1,
                        msg: `Không tìm thấy dự án hỗ trợ "${categoryName}"`,
                    });
                }

                const campaigns = await db.Campaign.findAll({
                    where: { categoryId: category.id },
                    include: [{ model: db.Status, as: "status" }],
                });

                if (campaigns.length === 0) {
                    return resolve({
                        err: 0,
                        msg: "OK",
                        data: `Hiện tại không có chiến dịch nào hỗ trợ "${categoryName}".`,
                    });
                }

                const campaignDetails = campaigns
                    .map((campaign) => `- ${campaign.title} `)
                    .join("\n");

                return resolve({
                    err: 0,
                    msg: "OK",
                    data: `${campaignDetails}`,
                });
            }

            if (message.includes("Các dự án đang gây quỹ")) {
                const campaigns = await db.Campaign.findAll({
                    where: {
                        currentAmount: {
                            [Op.lt]: db.Sequelize.col("targetAmount"),
                        },
                    },
                    include: [{ model: db.Status, as: "status" }],
                });

                if (campaigns.length === 0) {
                    return reject({
                        err: -1,
                        msg: "Không có dự án nào đang gây quỹ.",
                    });
                }

                const campaignDetails = campaigns
                    .map(
                        (campaign) =>
                            `- ${campaign.title} ${campaign.targetAmount}`
                    )
                    .join("\n");

                return resolve({
                    err: 0,
                    msg: "OK",
                    data: `${campaignDetails}`,
                });
            }

            if (message.includes("Dự án đang cần quyên góp ngay lập tức")) {
                const campaigns = await db.Campaign.findAll({
                    where: {
                        currentAmount: {
                            [Op.lt]: db.Sequelize.literal("targetAmount * 0.3"),
                        },
                    },
                    include: [{ model: db.Status, as: "status" }],
                });

                if (campaigns.length === 0) {
                    return reject({
                        err: -1,
                        msg: "Không có dự án nào cần quyên góp ngay lập tức.",
                    });
                }

                const campaignDetails = campaigns
                    .map(
                        (campaign) =>
                            `- ${campaign.title}: Đã quyên góp được: ${campaign.currentAmount}`
                    )
                    .join("\n");

                return resolve({
                    err: 0,
                    msg: "OK",
                    data: `${campaignDetails}`,
                });
            }

            if (message.includes("Công việc của tình nguyện viên là gì")) {
                try {
                    const taskTypes = await db.TaskType.findAll({
                        attributes: ["name", "description"],
                    });

                    if (taskTypes.length === 0) {
                        return resolve({
                            err: -1,
                            msg: "Không tìm thấy công việc tình nguyện viên.",
                            data: "Hiện tại không có công việc tình nguyện viên nào được liệt kê.",
                        });
                    }
                    const taskDetails = taskTypes
                        .map(
                            (taskType) =>
                                `- ${taskType.name}. Mô tả: ${taskType.description}.`
                        )
                        .join("\n\n");

                    return resolve({
                        err: 0,
                        msg: "OK",
                        data: `${taskDetails}`,
                    });
                } catch (error) {
                    console.error("Error while fetching task types: ", error);
                    return reject({
                        err: -1,
                        msg: "Lỗi khi lấy thông tin công việc tình nguyện viên.",
                        error: error.message || "Unknown error",
                    });
                }
            }

            // Nếu không xác định được câu hỏi, gọi API Groq
            const config = {
                method: "post",
                url: "https://api.groq.com/openai/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                data: {
                    model: "llama3-8b-8192",
                    messages: [
                        {
                            role: "user",
                            content: message,
                        },
                        {
                            role: "system",
                            content: "Please respond in Vietnamese.",
                        },
                    ],
                },
            };

            const response = await axios(config);
            if (response.data?.choices?.length > 0) {
                const choice = response.data.choices[0];

                const messageContent =
                    choice.message?.content || "Không có câu trả lời.";

                resolve({
                    err: 0,
                    msg: "OK",
                    data: messageContent,
                });
            } else {
                reject({
                    err: -1,
                    msg: "No valid choices available in the response",
                });
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                "Unknown error";
            console.log("Error response: ", errorMsg);

            reject({
                err: -1,
                msg: "Failed to get response from GroqAPI",
                error: errorMsg,
            });
        }
    });
