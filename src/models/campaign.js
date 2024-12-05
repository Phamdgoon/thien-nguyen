"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Campaign extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Campaign.belongsTo(models.Status, {
                foreignKey: "statusId",
                as: "status",
            });
            Campaign.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category",
            });
            Campaign.hasMany(models.Image, {
                foreignKey: "campaignId",
                as: "images",
            });
            Campaign.hasMany(models.Donation, {
                foreignKey: "campaignId",
                as: "donations",
            });
            Campaign.hasMany(models.Task, {
                foreignKey: "campaignId",
                as: "tasks",
            });
            Campaign.hasMany(models.VolunteerCampaign, {
                foreignKey: "campaignId",
                as: "volunteerCampaigns",
            });
            Campaign.belongsTo(models.Organization, {
                foreignKey: "organizationId",
                as: "organization",
            });
        }
    }
    Campaign.init(
        {
            organizationId: DataTypes.STRING,
            statusId: DataTypes.INTEGER,
            categoryId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
            targetAmount: DataTypes.STRING,
            currentAmount: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Campaign",
        }
    );
    return Campaign;
};
