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

    await queryInterface.addColumn('musics', 'video_background', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('musics', 'video_background_compressed', {
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
    await queryInterface.removeColumn('musics', 'video_background');
    await queryInterface.removeColumn('musics', 'video_background_compressed');
  }
};
