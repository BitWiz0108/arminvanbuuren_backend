'use strict';

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
    await queryInterface.bulkInsert('payment_gateways', [
      {
        paypalClientId: "PAYPAL_CLIENT_ID",
        paypalClientSecret: "PAYPAL_CLIENT_SECRET",
        stripePublicApiKey: "STRIPE_PUBLIC_API_KEY",
        stripeSecretKey: "STRIPE_SECRET_KEY",
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
    await queryInterface.bulkDelete('payment_gateways', null, {});
  }
};
