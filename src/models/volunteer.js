"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Volunteer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Volunteer.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            Volunteer.hasMany(models.Task, {
                foreignKey: "volunteerId",
                as: "tasks",
            });
            Volunteer.hasMany(models.VolunteerCampaign, {
                foreignKey: "volunteerId",
                as: "volunteerCampaigns",
            });
            Volunteer.belongsTo(models.Status, {
                foreignKey: "statusId",
                as: "status",
            });
        }
    }
    Volunteer.init(
        {
            userId: DataTypes.STRING,
            statusId: DataTypes.INTEGER,
            skills: DataTypes.STRING,
            experience: DataTypes.STRING,
            taskName: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Volunteer",
        }
    );
    return Volunteer;
};
