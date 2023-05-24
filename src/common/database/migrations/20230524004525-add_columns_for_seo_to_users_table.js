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

    await queryInterface.addColumn('users', 'site_name', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'site_url', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'site_title', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'site_description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('users', 'site_social_preview_image', {
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
    await queryInterface.removeColumn('users', 'site_name');
    await queryInterface.removeColumn('users', 'site_url');
    await queryInterface.removeColumn('users', 'site_title');
    await queryInterface.removeColumn('users', 'site_description');
    await queryInterface.removeColumn('users', 'site_social_preview_image');
  }
};
