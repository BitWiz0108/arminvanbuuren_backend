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
    await queryInterface.createTable('transactions', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      type: { type: Sequelize.ENUM('SUBSCRIPTION', 'DONATION',), allowNull: false, },
      user_id: { type: Sequelize.BIGINT, allowNull: false, },
      livestream_id: { type: Sequelize.BIGINT, },
      music_id: { type: Sequelize.BIGINT, },
      plan_id: { type: Sequelize.INTEGER, },
      provider: { type: Sequelize.ENUM('PAYPAL', 'STRIPE', ), },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, },
      currency_id: { type: Sequelize.INTEGER, allowNull: false, },
      order_id: { type: Sequelize.STRING, allowNull: false, },
      status: { type: Sequelize.ENUM('SUCCEEDED', 'PENDING', 'FAILED') },
      created_at: { type: Sequelize.DATEONLY, allowNull: false },
      updated_at: { type: Sequelize.DATEONLY, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('transactions');
  }
};
