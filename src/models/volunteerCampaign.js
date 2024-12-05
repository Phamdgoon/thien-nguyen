"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class VolunteerCampaign extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VolunteerCampaign.belongsTo(models.Volunteer, {
                foreignKey: "volunteerId",
                as: "volunteer",
            });
            VolunteerCampaign.belongsTo(models.Campaign, {
                foreignKey: "campaignId",
                as: "campaign",
            });
        }
    }
    VolunteerCampaign.init(
        {
            volunteerId: DataTypes.STRING,
            campaignId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "VolunteerCampaign",
        }
    );
    return VolunteerCampaign;
};
