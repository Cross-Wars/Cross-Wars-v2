/* This script bundles all the crosswords in the current folder 
and exports them as one big array for database seeding */

const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const crosswordObj = {};

files.map((file) => {
  if (file.startsWith('0') || file.startsWith('1')) {
    crosswordObj[file.slice(0, -3)] = require(path.join(__dirname, file));
  }
});

const crosswords = Object.values(crosswordObj);

module.exports = crosswords;
