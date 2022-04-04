const crosswordRouter = require('express').Router();
const Sequelize = require('sequelize');
const {
  models: { Crossword },
} = require('../db');

//GET /api/crosswords/random
crosswordRouter.get('/random', async (req, res, next) => {
  try {
    const crossword = await Crossword.findOne({
      order: [Sequelize.fn('random')],
    });
    res.send(crossword);
  } catch (err) {
    next(err);
  }
});

//GET /api/crosswords/:year
crosswordRouter.get('/:year', async (req, res, next) => {
  try {
    const crosswords = await Crossword.findAll({
      where: {
        date: {
          [Sequelize.Op.and]: {
            [Sequelize.Op.gte]: new Date(req.params.year, 0, 1),
            [Sequelize.Op.lte]: new Date(req.params.year, 11, 31),
          },
        },
      },
    });
    res.send(crosswords);
  } catch (err) {
    next(err);
  }
});

module.exports = crosswordRouter;
