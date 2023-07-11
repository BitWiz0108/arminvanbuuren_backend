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
    await queryInterface.createTable('home', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      type: {
        type: Sequelize.ENUM('VIDEO', 'IMAGE'),
      },
      background_image: { type: Sequelize.STRING, },
      background_image_compressed: { type: Sequelize.STRING, },
      background_video: { type: Sequelize.STRING, },
      background_video_compressed: { type: Sequelize.STRING, },
      youtube_video_url: { type: Sequelize.STRING, },
      youtube_title: { type: Sequelize.STRING, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('home');
  }
};
