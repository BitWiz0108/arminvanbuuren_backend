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
    await queryInterface.createTable('music_genres', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      name: { type: Sequelize.STRING, allowNull: false },
      cover_image: { type: Sequelize.STRING, allowNull: false },
      is_featured: { type: Sequelize.BOOLEAN, },
      is_trending: { type: Sequelize.BOOLEAN, },
      is_recommended: { type: Sequelize.BOOLEAN, },
      status: { type: Sequelize.BOOLEAN, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('music_genres');
  }
};
