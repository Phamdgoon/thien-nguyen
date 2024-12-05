import db from "../models";
import { sequelize } from "../models";

export const getDonationsByTimeService = (timePeriod) =>
    new Promise(async (resolve, reject) => {
        try {
            let groupByClause;
            let attributes = [
                [
                    sequelize.fn("SUM", sequelize.col("amount")),
                    "totalDonations",
                ],
            ];
            switch (timePeriod) {
                case "year":
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("donationDate")),
                    ];
                    attributes.unshift([
                        sequelize.fn("YEAR", sequelize.col("donationDate")),
                        "year",
                    ]);
                    break;

                case "quarter":
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("donationDate")),
                        sequelize.fn("QUARTER", sequelize.col("donationDate")),
                    ];
                    attributes.unshift(
                        [
                            sequelize.fn("YEAR", sequelize.col("donationDate")),
                            "year",
                        ],
                        [
                            sequelize.fn(
                                "QUARTER",
                                sequelize.col("donationDate")
                            ),
                            "quarter",
                        ]
                    );
                    break;

                case "month":
                default:
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("donationDate")),
                        sequelize.fn("MONTH", sequelize.col("donationDate")),
                    ];
                    attributes.unshift(
                        [
                            sequelize.fn("YEAR", sequelize.col("donationDate")),
                            "year",
                        ],
                        [
                            sequelize.fn(
                                "MONTH",
                                sequelize.col("donationDate")
                            ),
                            "month",
                        ]
                    );
                    break;
            }
            const donations = await db.Donation.findAll({
                attributes: attributes,
                group: groupByClause,
                raw: true,
            });

            resolve({
                err: donations.length > 0 ? 0 : 1,
                msg: donations.length > 0 ? "OK" : "No data found.",
                response: donations,
            });
        } catch (error) {
            reject(error);
        }
    });
export const getCampaignsOrganizationByTimeService = (timePeriod) =>
    new Promise(async (resolve, reject) => {
        try {
            let groupByClause;
            let attributes = [
                [sequelize.fn("COUNT", sequelize.col("id")), "totalCampaigns"],
            ];
            switch (timePeriod) {
                case "year":
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("startDate")),
                    ];
                    attributes.unshift([
                        sequelize.fn("YEAR", sequelize.col("startDate")),
                        "year",
                    ]);
                    break;

                case "quarter":
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("startDate")),
                        sequelize.fn("QUARTER", sequelize.col("startDate")),
                    ];
                    attributes.unshift(
                        [
                            sequelize.fn("YEAR", sequelize.col("startDate")),
                            "year",
                        ],
                        [
                            sequelize.fn("QUARTER", sequelize.col("startDate")),
                            "quarter",
                        ]
                    );
                    break;

                case "month":
                default:
                    groupByClause = [
                        sequelize.fn("YEAR", sequelize.col("startDate")),
                        sequelize.fn("MONTH", sequelize.col("startDate")),
                    ];
                    attributes.unshift(
                        [
                            sequelize.fn("YEAR", sequelize.col("startDate")),
                            "year",
                        ],
                        [
                            sequelize.fn("MONTH", sequelize.col("startDate")),
                            "month",
                        ]
                    );
                    break;
            }
            const campaigns = await db.Campaign.findAll({
                attributes: attributes,
                group: groupByClause,
                raw: true,
            });

            resolve({
                err: campaigns.length > 0 ? 0 : 1,
                msg: campaigns.length > 0 ? "OK" : "No data found.",
                response: campaigns,
            });
        } catch (error) {
            reject(error);
        }
    });
