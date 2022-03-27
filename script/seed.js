'use strict';

const {
  db,
  models: { User, Crossword },
} = require('../server/db');

const cs1 = require('../public/crosswords/cs1');
const cs2 = require('../public/crosswords/cs2');
const cs3 = require('../public/crosswords/cs3');
const cs4 = require('../public/crosswords/cs4');
const cs5 = require('../public/crosswords/cs5');
const cs6 = require('../public/crosswords/cs6');
const cs7 = require('../public/crosswords/cs7');
const cs8 = require('../public/crosswords/cs8');
const cs9 = require('../public/crosswords/cs9');
const cs10 = require('../public/crosswords/cs10');
const cs11 = require('../public/crosswords/cs11');
const cs12 = require('../public/crosswords/cs12');
const cs13 = require('../public/crosswords/cs13');
const dataFormatter = require('../public/crosswords/conversion');

const data = [
  cs1,
  cs2,
  cs3,
  cs4,
  cs5,
  cs6,
  cs7,
  cs8,
  cs9,
  cs10,
  cs11,
  cs12,
  cs13,
];
const crosswords = data.map((crossword) => {
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
  };
});

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
      return Crossword.create(crossword);
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
