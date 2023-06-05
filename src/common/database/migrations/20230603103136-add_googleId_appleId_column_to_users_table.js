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

    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'apple_id', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('users', 'facebook_id', {
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'google_id');
    await queryInterface.removeColumn('users', 'apple_id');
    await queryInterface.changeColumn('users', 'facebook_id', {
      type: Sequelize.BIGINT,
    });
  }
};
