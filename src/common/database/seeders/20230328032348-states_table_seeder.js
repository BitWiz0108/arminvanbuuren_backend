'use strict';

const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jsonFilePath = path.join(__dirname, 'json/states.json');

    const states = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(jsonFilePath)
        .pipe(JSONStream.parse('*'))
        .on('data', (data) => {
          states.push({
            name: data.name,
            country_id: data.country_id,
          });
        })
        .on('end', async () => {
          // Insert the data into the database
          await queryInterface.bulkInsert('states', states, {});
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all the inserted data from the database
    await queryInterface.bulkDelete('states', null, {});
  },
};
