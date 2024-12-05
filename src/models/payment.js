"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Payment.belongsTo(models.Donation, {
                foreignKey: "donationId",
                as: "donation",
            });
        }
    }
    Payment.init(
        {
            donationId: DataTypes.INTEGER,
            orderId: DataTypes.STRING,
            paymentMethod: DataTypes.STRING,
            paymentStatus: DataTypes.STRING,
            paymentDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Payment",
        }
    );
    return Payment;
};
