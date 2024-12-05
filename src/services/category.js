import db from "../models";

export const getCategoriesService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Category.findAll({
                raw: true,
                attributes: ["code", "value"],
            });
            resolve({
                err: response ? 0 : 1,
                msg: response ? "OK" : "Failed to get category.",
                response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getCampaignsByCategoryService = (categoryCode) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOne({
                where: { code: categoryCode.trim() },
            });
            if (!category) {
                return resolve({
                    err: 1,
                    msg: "Category not found",
                    response: [],
                });
            }

            const campaigns = await db.Campaign.findAll({
                where: { categoryId: category.id },
                include: [
                    {
                        model: db.Category,
                        as: "category",
                        attributes: ["code", "value"],
                    },
                    { model: db.Image, as: "images", attributes: ["image"] },
                    {
                        model: db.Organization,
                        as: "organization",
                        attributes: ["image", "name"],
                    },
                ],
            });

            resolve({
                err: campaigns ? 0 : 1,
                msg: campaigns ? "OK" : "Failed to get campaigns.",
                response: campaigns,
            });
        } catch (error) {
            reject(error);
        }
    });
