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
    await queryInterface.bulkInsert('languages', [
      { name: 'English', code: 'en', is_default: 1, status: 1, },
      { name: 'Hindi', code: 'hi', is_default: 0, status: 1, },
      { name: 'German', code:	'de', is_default:	0, status: 1 },
      { name: 'Greek', code:	'el', is_default:	0, status: 1 },
      { name: 'Spanish', code:	'es', is_default:	0, status: 1 },
      { name: 'Arabic', code:	'ar', is_default:	0, status: 1 },
      { name: 'Estonian', code:	'et', is_default:	0, status: 1 },
      { name: 'Farsi', code: 'fa', is_default:	0, status: 1 },
      { name: 'French', code:	'fr', is_default:	0, status: 1 },
      { name: 'Indonesian', code:	'id', is_default:	0, status: 1 },
      { name: 'Italian', code: 'it', is_default:	0, status: 1 },
      { name: 'Dutch', code: 'nl', is_default:	0, status: 1 },
      { name: 'Polish', code:	'pl', is_default:	0, status: 1 },
      { name: 'Portuguese', code:	'pt', is_default:	0, status: 1 },
      { name: 'Romanian', code:	'ro', is_default:	0, status: 1 },
      { name: 'Russian', code: 'ru', is_default:	0, status: 1 },
      { name: 'Turkish', code: 'tr', is_default:	0, status: 1 },
      { name: 'Urdu', code:	'ur', is_default:	0, status: 1 },
      { name: 'Chinese', code:	'zh', is_default:	0, status: 1 },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('languages', null, {});
  }
};
