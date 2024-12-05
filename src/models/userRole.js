"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UserRole.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            UserRole.belongsTo(models.Organization, {
                foreignKey: "organizationId",
                as: "organization",
            });
            UserRole.belongsTo(models.Role, {
                foreignKey: "roleId",
                as: "role",
            });
        }
    }
    UserRole.init(
        {
            userId: DataTypes.STRING,
            organizationId: DataTypes.STRING,
            roleId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "UserRole",
        }
    );
    return UserRole;
};
