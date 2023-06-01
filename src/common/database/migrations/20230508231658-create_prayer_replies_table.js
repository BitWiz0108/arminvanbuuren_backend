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
    await queryInterface.createTable('prayer_request_replies', { 
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      user_id: { type: Sequelize.BIGINT, allowNull: false, },
      prayer_request_id: { type: Sequelize.BIGINT, allowNull: false, },
      content: { type: Sequelize.STRING, allowNull: false },
      is_anonymous: { type: Sequelize.BOOLEAN, allowNull: false },
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
    await queryInterface.dropTable('prayer_request_replies');
  }
};
