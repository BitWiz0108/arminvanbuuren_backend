'use strict';

const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jsonFilePath = path.join(__dirname, 'json/cities.json');

    const cities = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(jsonFilePath)
        .pipe(JSONStream.parse('*'))
        .on('data', (data) => {
          cities.push({
            name: data.name,
            state_id: data.state_id,
          });
        })
        .on('end', async () => {
          // Insert the data into the database
          await queryInterface.bulkInsert('cities', cities, {});
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all the inserted data from the database
    await queryInterface.bulkDelete('cities', null, {});
  },
};
