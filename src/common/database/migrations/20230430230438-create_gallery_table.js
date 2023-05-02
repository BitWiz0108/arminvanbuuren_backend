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
      image: { type: Sequelize.STRING, allowNull: false, },
      compressed_image: { type: Sequelize.STRING, allowNull: false, },
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
