'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const email_verification_path = path.join(__dirname, 'html/email-verification.html');
    const email_verification_content_path = path.join(__dirname, 'html/email-verification-content.html');

    const email_verification_html = fs.readFileSync(email_verification_path, 'utf8');
    const email_verification_content = fs.readFileSync(email_verification_content_path, 'utf8');

    const password_reset_path = path.join(__dirname, 'html/password-reset.html');
    const password_reset_content_path = path.join(__dirname, 'html/password-reset-content.html');

    const password_reset_html = fs.readFileSync(password_reset_path, 'utf8');
    const password_reset_content = fs.readFileSync(password_reset_content_path, 'utf8');

    const thankyou_path = path.join(__dirname, 'html/thankyou.html');
    const thankyou_content_path = path.join(__dirname, 'html/thankyou-content.html');

    const thankyou_html = fs.readFileSync(thankyou_path, 'utf8');
    const thankyou_content = fs.readFileSync(thankyou_content_path, 'utf8');

    await queryInterface.bulkInsert('email_templates', [
      {
        type: "THANK",
        title: "Thank You for Subscribing to the MaxLife Fan Club",
        html: thankyou_html,
        content: thankyou_content,
        from_name: "Lions & Legacy Support Team",
        from_email: "no-reply@lionsandlegacy.com",
        subject: "Thank You for Subscribing to the MaxLife Fan Club"
      },
      {
        type: "EMAIL_VERIFICATION",
        title: "Verify your email address",
        html: email_verification_html,
        content: email_verification_content,
        from_name: "Lions & Legacy Support Team",
        from_email: "no-reply@lionsandlegacy.com",
        subject: "Email Verification",
      },
      {
        type: "PASSWORD_RESET",
        title: "Password Reset Request",
        html: password_reset_html,
        content: password_reset_content,
        from_name: "Lions & Legacy Support Team",
        from_email: "no-reply@lionsandlegacy.com",
        subject: "Password Reset",
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('email_templates', null, {});
  }
};
