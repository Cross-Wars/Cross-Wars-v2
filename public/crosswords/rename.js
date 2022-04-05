/* This script will scan through a given year of nyt crossword files,
dynamically rename them all by their date, and pull them all into one
directory for export. Works specifically for the doshea/nyt_crosswords repo */
const fs = require('fs');
const files = fs.readdirSync(__dirname);

//---------RENAME FILES
for (const file of files) {
  const innerFiles = fs.readdirSync(file);
  for (const json of innerFiles) {
    if (json.endsWith('.json')) {
      fs.rename(
        __dirname + '/' + file + '/' + json,
        __dirname +
          '/' +
          file +
          '-' +
          json.replace('.json', '') +
          '-' +
          `${__dirname.slice(-2)}.js`,
        (err) => {
          if (err) console.log('Error: Cannot edit file name');
          else console.log('File renamed!');
        }
      );
    }
  }
}
