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
    await queryInterface.createTable('plans', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      image: { type: Sequelize.STRING, },
      name: { type: Sequelize.STRING, allowNull: false, },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, },
      currency_id: { type: Sequelize.INTEGER, allowNull: false, },
      description: { type: Sequelize.TEXT, allowNull: false, },
      duration: { type: Sequelize.INTEGER, allowNull: false, }, // in days
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
    await queryInterface.dropTable('plans');
  }
};
