'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const csvFilePath = path.join(__dirname, 'csv/all_countries.csv');

    const countries = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // Map CSV fields to model attributes
          countries.push({
            name: data.name,
            code: data.code,
            iso: data.iso,
            iso3: data.iso3,
            numcode: data.numcode,
            phonecode: data.phonecode,
          });
        })
        .on('end', async () => {
          // Insert the data into the database
          await queryInterface.bulkInsert('countries', countries, {});
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all the inserted data from the database
    await queryInterface.bulkDelete('countries', null, {});
  },
};
