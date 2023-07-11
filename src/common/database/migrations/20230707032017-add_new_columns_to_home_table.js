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

    await queryInterface.addColumn('home', 'signin_background_video', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('home', 'signin_background_video_compressed', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('home', 'signin_background_image', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('home', 'signin_background_image_compressed', {
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
    await queryInterface.removeColumn('home', 'signin_background_video');
    await queryInterface.removeColumn('home', 'signin_background_video_compressed');
    await queryInterface.removeColumn('home', 'signin_background_image');
    await queryInterface.removeColumn('home', 'signin_background_image_compressed');
  }
};
