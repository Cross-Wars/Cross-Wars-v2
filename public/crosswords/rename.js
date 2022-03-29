//This script renames each crossword file
//for whichever directory of crosswords it's ran in
const fs = require('fs');
const files = fs.readdirSync(__dirname);

//---------RENAME FILES
for (const file of files) {
  if (file.endsWith('.json')) {
    fs.rename(
      __dirname + '/' + file,
      __dirname +
        '/' +
        `${__dirname.slice(-2)}-` +
        file.replace('.json', '') +
        `-${__dirname.slice(-5, -3)}.js`,
      (err) => {
        if (err) console.log('Error: Cannot edit file name');
        else console.log('File renamed!');
      }
    );
  }
}
console.log(__dirname.slice(-5, -3));
