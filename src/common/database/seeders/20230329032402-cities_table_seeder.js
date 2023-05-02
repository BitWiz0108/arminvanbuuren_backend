'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const csvFilePath = path.join(__dirname, 'csv/all_cities.csv');

    const cities = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // Map CSV fields to model attributes
          cities.push({
            name: data.name,
            state_id: data.state_id,
            zipcode: data.zipcode,
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
