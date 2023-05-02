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
    await queryInterface.createTable('musics', { 
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      cover_image: { type: Sequelize.STRING, allowNull: false }, // coverimage
      music_file: { type: Sequelize.STRING, allowNull: false },
      music_file_compressed: { type: Sequelize.STRING, allowNull: false },
      download_price: { type: Sequelize.INTEGER, },
      album_id: { type: Sequelize.INTEGER, },
      duration: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      music_genre_id: { type: Sequelize.INTEGER, },
      user_id: { type: Sequelize.BIGINT, allowNull: false },
      language_id: { type: Sequelize.INTEGER, allowNull: false },
      copyright: { type: Sequelize.STRING, },
      listening_count: { type: Sequelize.BIGINT, allowNull: false },
      is_featured: { type: Sequelize.BOOLEAN, },
      is_trending: { type: Sequelize.BOOLEAN, },
      is_recommended: { type: Sequelize.BOOLEAN, },
      status: { type: Sequelize.BOOLEAN, allowNull: false },
      lyrics: { type: Sequelize.TEXT, },
      description: { type: Sequelize.TEXT, },
      release_date: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.STRING, },
      updated_at: { type: Sequelize.STRING, },
      is_exclusive: { type: Sequelize.BOOLEAN, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('musics');
  }
};
