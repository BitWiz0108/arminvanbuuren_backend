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
    await queryInterface.addColumn('home', 'signin_description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('home', 'homepage_description', {
      type: Sequelize.TEXT,
    });
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('home', 'signin_description');
    await queryInterface.removeColumn('home', 'homepage_description');
  }
};
