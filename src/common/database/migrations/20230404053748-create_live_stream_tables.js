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
    await queryInterface.createTable('live_streams', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      cover_image: { type: Sequelize.STRING, allowNull: false }, // compressed as default
      title: { type: Sequelize.STRING, allowNull: false, },
      user_id: { type: Sequelize.BIGINT, allowNull: false }, // artist
      creator_id: { type: Sequelize.BIGINT, },
      category_id: { type: Sequelize.INTEGER },
      release_date: { type: Sequelize.STRING, allowNull: false, },
      preview_video: { type: Sequelize.STRING, allowNull: false, },
      preview_video_compressed: { type: Sequelize.STRING, allowNull: false, },
      full_video: { type: Sequelize.STRING, allowNull: false, },
      full_video_compressed: { type: Sequelize.STRING, allowNull: false, },
      lyrics: { type: Sequelize.TEXT, },
      duration: { type: Sequelize.INTEGER, allowNull: false, },
      short_description: { type: Sequelize.TEXT, },
      language_id: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.TEXT, },
      is_exclusive: { type: Sequelize.BOOLEAN, allowNull: false, },
      created_at: { type: Sequelize.STRING, },
      updated_at: { type: Sequelize.STRING, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('live_streams');
  }
};
