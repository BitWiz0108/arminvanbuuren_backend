'use strict';
// import * as bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
const moment = require('moment/moment');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'maxlife',
        first_name: 'Max',
        last_name: 'Soussan',
        artist_name: 'Maxlife',
        email: 'max@lionsandlegacy.com',
        email_verified_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        password: bcrypt.hashSync("admin", 10),
        role_id: 1,
        status: 1,
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
    await queryInterface.bulkDelete('users', null, {});
  }
};
