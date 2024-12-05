"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class TaskType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            TaskType.hasMany(models.Task, {
                foreignKey: "taskTypeId",
                as: "tasks",
            });
        }
    }
    TaskType.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "TaskType",
        }
    );
    return TaskType;
};
