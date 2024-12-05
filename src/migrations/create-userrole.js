"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("UserRoles", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.STRING,
            },
            organizationId: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("UserRoles");
    },
};
