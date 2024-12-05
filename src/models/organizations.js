"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Organization extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Organization.hasMany(models.Campaign, {
                foreignKey: "organizationId",
                as: "campaigns",
            });
            Organization.hasMany(models.UserRole, {
                foreignKey: "organizationId",
                as: "userRoles",
            });
        }
    }
    Organization.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Organization",
        }
    );
    return Organization;
};
