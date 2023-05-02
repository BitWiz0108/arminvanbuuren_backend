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
    await queryInterface.createTable('albums', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      image: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      user_id: { type: Sequelize.BIGINT, allowNull: false }, // artist
      description: { type: Sequelize.TEXT, },
      copyright: { type: Sequelize.STRING, },
      is_featured: { type: Sequelize.BOOLEAN, },
      is_trending: { type: Sequelize.BOOLEAN, },
      is_recommended: { type: Sequelize.BOOLEAN, },
      is_verified: { type: Sequelize.BOOLEAN, allowNull: false },
      status: { type: Sequelize.BOOLEAN, },
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
    await queryInterface.dropTable('albums');
  }
};
