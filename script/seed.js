'use strict';
const {
  db,
  models: { User, Crossword },
} = require('../server/db');
const dataFormatter = require('../public/crosswords/conversion');
const crosswordList = require('../public/crosswords/exports');

const makeCrossword = (array) => {
  return array.map((crossword) => {
    if (crossword.gridnums.length === 225) {
      //Check for Rebuses
      let rebus = false;
      for (let i = 0; i < crossword.grid.length; i++) {
        if (crossword.grid[i].length > 1) {
          rebus = true;
          break;
        }
      }
      //Create crossword object
      if (!rebus) {
        return {
          name: crossword.title,
          date: new Date(crossword.date),
          difficulty: `${
            crossword.dow === 'Monday' || crossword.dow === 'Tuesday'
              ? 'easy'
              : crossword.dow === 'Wednesday' || crossword.dow === 'Thursday'
              ? 'medium'
              : 'hard'
          }`,
          author: crossword.author,
          data: JSON.stringify(dataFormatter(crossword)),
          grid: crossword.grid,
        };
      }
    }
  });
};

const crosswords = makeCrossword(crosswordList);

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);
  await Promise.all(
    crosswords.map((crossword) => {
      if (crossword) {
        return Crossword.create(crossword);
      }
    })
  );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
