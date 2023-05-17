'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true, },
      username: { type: Sequelize.STRING, allowNull: false, unique: true, },
      first_name: { type: Sequelize.STRING, },
      last_name: { type: Sequelize.STRING, },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      email_verified_at: { type: Sequelize.DATE, },
      role_id: { type: Sequelize.STRING, },
      facebook_id: { type: Sequelize.BIGINT, },
      artist_verify_status: {
        type: Sequelize.ENUM('PENDING', 'DECLINED', 'APPROVED'),
      },
      artist_genre_id: { type: Sequelize.INTEGER, },
      artist_name: { type: Sequelize.STRING, },
      accept_term_and_policy: { type: Sequelize.BOOLEAN },
      avatar_image: { type: Sequelize.STRING, },
      logo_image: { type: Sequelize.STRING, },
      banner_type: {
        type: Sequelize.ENUM('VIDEO', 'IMAGE'),
      },
      banner_image: { type: Sequelize.STRING, },
      banner_image_compressed: { type: Sequelize.STRING, },
      banner_video: { type: Sequelize.STRING, },
      banner_video_compressed: { type: Sequelize.STRING, },
      mobile: { type: Sequelize.STRING, },
      gender: { 
        type: Sequelize.ENUM('FEMAIL', 'MALE'),
      },
      description: { type: Sequelize.TEXT },
      website: { type: Sequelize.STRING },
      facebook_url: { type: Sequelize.STRING },
      instagram_url: { type: Sequelize.STRING },
      youtube_url: { type: Sequelize.STRING },
      twitter_url: { type: Sequelize.STRING },
      soundcloud_url: { type: Sequelize.STRING },
      plan_id: { type: Sequelize.INTEGER, },
      plan_start_date: { type: Sequelize.STRING, },
      plan_end_date: { type: Sequelize.STRING, },
      date_of_birth: { type: Sequelize.STRING, },
      status: { type: Sequelize.BOOLEAN, },
      address: { type: Sequelize.STRING, },
      country: { type: Sequelize.STRING, },
      state: { type: Sequelize.STRING, },
      city: { type: Sequelize.STRING, },
      zipcode: { type: Sequelize.STRING, },
      is_featured: { type: Sequelize.BOOLEAN, },
      is_trending: { type: Sequelize.BOOLEAN, },
      is_recommended: { type: Sequelize.BOOLEAN, },
      remember_token: { type: Sequelize.STRING, },
      created_at: { type: Sequelize.STRING, },
      updated_at: { type: Sequelize.STRING, },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};