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
    await queryInterface.createTable('currencies', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      name: { type: Sequelize.CHAR, allowNull: false, },
      code: { type: Sequelize.CHAR, allowNull: false, },
      symbol: { type: Sequelize.CHAR, allowNull: false, },
      format: { type: Sequelize.CHAR, allowNull: false, },
      exchange_rate: { type: Sequelize.FLOAT, allowNull: false, },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('currencies');
  }
};
