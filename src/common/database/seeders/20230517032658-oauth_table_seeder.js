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

    await queryInterface.bulkInsert('oauth', [
      {
        provider: "FACEBOOK",
        app_id: "YOUR_FACEBOOK_APP_ID",
        app_secret: "YOUR_FACEBOOK_APP_SECRET",
      },
      {
        provider: "TWITTER",
        app_id: "YOUR_TWITTER_APP_ID",
        app_secret: "YOUR_TWITTER_APP_SECRET",
      },
      {
        provider: "INSTAGRAM",
        app_id: "YOUR_INSTAGRAM_APP_ID",
        app_secret: "YOUR_INSTAGRAM_APP_SECRET",
      },
      {
        provider: "AMAZON",
        app_id: "YOUR_AMAZON_APP_ID",
        app_secret: "YOUR_AMAZON_APP_SECRET",
      },
      {
        provider: "GITHUB",
        app_id: "YOUR_GITHUB_APP_ID",
        app_secret: "YOUR_GITHUB_APP_SECRET",
      },
      {
        provider: "LINKEDIN",
        app_id: "YOUR_LINKEDIN_APP_ID",
        app_secret: "YOUR_LINKEDIN_APP_SECRET",
      },
      {
        provider: "YOUTUBE",
        app_id: "YOUR_YOUTUBE_APP_ID",
        app_secret: "YOUR_YOUTUBE_APP_SECRET",
      },
      {
        provider: "GOOGLE",
        app_id: "YOUR_GOOGLE_APP_ID",
        app_secret: "YOUR_GOOGLE_APP_SECRET",
      },
      {
        provider: "APPLE",
        app_id: "YOUR_APPLE_APP_ID",
        app_secret: "YOUR_APPLE_APP_SECRET",
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('oauth', null, {});
  }
};
