'use strict';

const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jsonFilePath = path.join(__dirname, 'json/countries.json');

    const countries = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(jsonFilePath)
        .pipe(JSONStream.parse('*'))
        .on('data', (data) => {
          countries.push({
            code: data.code,
            iso: data.iso,
            iso3: data.iso3,
            name: data.name,
            numcode: data.numcode.toString(),
            phonecode: data.phonecode
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
