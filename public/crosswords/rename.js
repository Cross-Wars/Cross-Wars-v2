//This script renames each crossword file
//for whichever directory of crosswords it's ran in
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
      console.log(__dirname + '/' + file + '/' + json);
      console.log(
        __dirname +
          '/' +
          file +
          '-' +
          json.replace('.json', '') +
          '-' +
          `${__dirname.slice(-2)}.js`
      );
    }
  }
}
