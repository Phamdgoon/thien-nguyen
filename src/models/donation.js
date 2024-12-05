"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Donation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Donation.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            Donation.hasOne(models.Payment, {
                foreignKey: "donationId",
                as: "payment",
            });
            Donation.belongsTo(models.Campaign, {
                foreignKey: "campaignId",
                as: "campaign",
            });
        }
    }
    Donation.init(
        {
            campaignId: DataTypes.INTEGER,
            userId: DataTypes.STRING,
            amount: DataTypes.STRING,
            donationDate: DataTypes.DATE,
            itemName: DataTypes.STRING,
            quantity: DataTypes.STRING,
            unit: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Donation",
        }
    );
    return Donation;
};
