"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Payments", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            donationId: {
                type: Sequelize.INTEGER,
            },
            orderId: {
                type: Sequelize.STRING,
            },
            paymentMethod: {
                type: Sequelize.STRING,
            },
            paymentStatus: {
                type: Sequelize.STRING,
            },
            paymentDate: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Payments");
    },
};
