/* These functions take the original NYT crosswords and converts
 them into a format that can be read by the react-crossword library */

function make2DArray(grid) {
  const divisor = Math.sqrt(grid.length);
  let result = [];
  for (let i = 0; i < divisor; i++) {
    result.push(grid.slice(i * divisor, (i + 1) * divisor));
  }
  return result;
}

function getClueCoords(map) {
  let result = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      const clue = map[y][x];
      if (clue !== 0) {
        result[clue] = {
          row: y,
          col: x,
        };
      }
    }
  }
  return result;
}

module.exports = (data) => {
  const across = {};
  const down = {};
  let i = 0;
  data.clues.across.forEach((clue) => {
    const split = clue.split('. ');
    const num = Number(split[0]);
    across[num] = {
      clue: split.slice(1).join('. '),
      answer: data.answers.across[i],
      row: 0,
      col: 0,
    };
    i++;
  });
  i = 0;
  data.clues.down.forEach((clue) => {
    const split = clue.split('. ');
    const num = Number(split[0]);
    down[num] = {
      clue: split.slice(1).join('. '),
      answer: data.answers.down[i],
      row: 0,
      col: 0,
    };
    i++;
  });
  const map = make2DArray(data.gridnums);
  const coords = getClueCoords(map);
  const coordsList = [...Object.keys(coords)];

  coordsList.forEach((coord) => {
    if (across[coord]) {
      across[coord].row = coords[coord].row;
      across[coord].col = coords[coord].col;
    }
    if (down[coord]) {
      down[coord].row = coords[coord].row;
      down[coord].col = coords[coord].col;
    }
  });
  return {
    across,
    down,
  };
};
