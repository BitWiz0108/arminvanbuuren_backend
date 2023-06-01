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
    await queryInterface.createTable('post_files', { 
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      post_id: { type: Sequelize.BIGINT, allowNull: false, },
      type: {
        type: Sequelize.ENUM('IMAGE', 'VIDEO',),
      },
      file: { type: Sequelize.STRING },
      file_compressed: { type: Sequelize.STRING },
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
    await queryInterface.dropTable('post_files');
  }
};
