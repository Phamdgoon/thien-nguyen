"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("VolunteerCampaigns", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            volunteerId: {
                type: Sequelize.INTEGER,
            },
            campaignId: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("VolunteerCampaigns");
    },
};
