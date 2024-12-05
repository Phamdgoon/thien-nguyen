"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasMany(models.UserRole, {
                foreignKey: "userId",
                as: "userRoles",
            });
            User.hasMany(models.Donation, {
                foreignKey: "userId",
                as: "donations",
            });
            User.hasOne(models.Volunteer, {
                foreignKey: "userId",
                as: "Volunteer",
            });
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            avatar: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
