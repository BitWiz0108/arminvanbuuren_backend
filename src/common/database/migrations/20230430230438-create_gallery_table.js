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
    await queryInterface.createTable('gallery', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      type: {
        type: Sequelize.ENUM('VIDEO', 'IMAGE'),
      },
      image: { type: Sequelize.STRING, },
      image_compressed: { type: Sequelize.STRING, },
      video: { type: Sequelize.STRING, },
      video_compressed: { type: Sequelize.STRING, },
      size: {
        type: Sequelize.ENUM('SQUARE', 'WIDE', 'TALL', 'WIDEANDTALL'),
      },
      description: { type: Sequelize.TEXT, },
      created_at: { type: Sequelize.DATE, allowNull: false, },
      updated_at: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('gallery');
  }
};
