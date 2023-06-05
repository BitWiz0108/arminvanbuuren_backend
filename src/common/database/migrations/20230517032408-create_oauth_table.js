'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('oauth', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      provider: {
        type: Sequelize.ENUM('FACEBOOK', 'TWITTER', 'INSTAGRAM', 'AMAZON', 'GITHUB', 'LINKEDIN', 'YOUTUBE', 'GOOGLE', 'APPLE'),
      },
      app_id: { type: Sequelize.TEXT, },
      app_secret: { type: Sequelize.TEXT, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('oauth');
  }
};
