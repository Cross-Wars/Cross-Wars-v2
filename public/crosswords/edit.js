//This script drops a 'module.exports=' in front of each file
//in whichever directory of crosswords it's ran in
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);

//---------EDIT FILES
for (const file of files) {
  if (file.startsWith('0') || file.startsWith('1')) {
    const currFile = path.join(__dirname, file);
    console.log(currFile);
    const data = fs.readFileSync(currFile); //read existing contents into data
    const fd = fs.openSync(currFile, 'w+');
    const buffer = Buffer.from('module.exports = ');

    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
    fs.close(fd);
  }
}
