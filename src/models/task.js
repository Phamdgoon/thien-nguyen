"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Task.belongsTo(models.Volunteer, {
                foreignKey: "volunteerId",
                as: "volunteer",
            });
            Task.belongsTo(models.Campaign, {
                foreignKey: "campaignId",
                as: "campaign",
            });
            Task.belongsTo(models.TaskType, {
                foreignKey: "taskTypeId",
                as: "taskType",
            });
        }
    }
    Task.init(
        {
            volunteerId: DataTypes.INTEGER,
            campaignId: DataTypes.INTEGER,
            taskTypeId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Task",
        }
    );
    return Task;
};
