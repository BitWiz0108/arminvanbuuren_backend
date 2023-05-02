'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const csvFilePath = path.join(__dirname, 'csv/all_states.csv');

    const states = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // Map CSV fields to model attributes
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
