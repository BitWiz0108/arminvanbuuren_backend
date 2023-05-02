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
    await queryInterface.createTable('countries', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      name: { type: Sequelize.CHAR, allowNull: false, },
      code: { type: Sequelize.CHAR, allowNull: false, },
      iso: { type: Sequelize.CHAR, allowNull: false, },
      iso3: { type: Sequelize.CHAR, allowNull: false, },
      numcode: { type: Sequelize.CHAR, allowNull: false, },
      phonecode: { type: Sequelize.CHAR, allowNull: false, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('countries');
  }
};
