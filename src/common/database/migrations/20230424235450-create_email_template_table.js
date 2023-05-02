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
    await queryInterface.createTable('email_templates', { 
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      logo_image: { type: Sequelize.STRING, },
      type: { type: Sequelize.ENUM('THANK', 'EMAIL_VERIFICATION', 'PASSWORD_RESET') },
      html: { type: Sequelize.TEXT, allowNull: false, },
      title: { type: Sequelize.TEXT, allowNull: false, },
      from_name: { type: Sequelize.STRING, },
      from_email: { type: Sequelize.STRING, },
      subject: { type: Sequelize.STRING },
      content: { type: Sequelize.TEXT, allowNull: false, },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('email_templates');
  }
};
